using KaazingChatApi;
using KaazingChatApi.JWTAuthentication.Authentication;
using KaazingTestWebApplication;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.SwaggerGen.ConventionalRouting;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

//builder.WebHost.ConfigureKestrel(options =>
//{
//    var port = 5187;
//    var pfxFilePath = Environment.GetEnvironmentVariable("pfxFilePath");
//    // The password you specified when exporting the PFX file using OpenSSL.
//    // This would normally be stored in configuration or an environment variable;
//    // I've hard-coded it here just to make it easier to see what's going on.
//    var pfxPassword = Environment.GetEnvironmentVariable("pfxPassword");

//    options.Listen(IPAddress.Any, port, listenOptions =>
//    {
//        // Enable support for HTTP1 and HTTP2 (required if you want to host gRPC endpoints)
//        listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
//        // Configure Kestrel to use a certificate from a local .PFX file for hosting HTTPS
//        listenOptions.UseHttps(pfxFilePath, pfxPassword);
//    });
//});


var config = builder.Configuration.GetSection("Kestrel:Certificates:Development");
string certsPath = config.GetSection("CertsPath").Value ?? string.Empty;
string password = config.GetSection("Pwd").Value ?? string.Empty;

builder.WebHost.ConfigureKestrel(options =>
{
    options.ConfigureHttpsDefaults(httpsOptions =>
    {
        // Important: Only enable TLS 1.2 and TLS 1.3 to comply with SSL Server tests.
        //            TLS 1.1, TLS 1.0 and SSLv3 are considered insecure by todays standards.
        httpsOptions.SslProtocols = System.Security.Authentication.SslProtocols.Tls12 | System.Security.Authentication.SslProtocols.Tls13;

        // Configure HTTPS certificate.
        if (!String.IsNullOrEmpty(certsPath))
        {
            httpsOptions.ServerCertificate = new X509Certificate2(certsPath, password);
        }

        // Configure the cipher suits preferred and supported by the server. (Windows- servers are not so keen on doing this ...)
        if (!System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(System.Runtime.InteropServices.OSPlatform.Windows))
        {
            httpsOptions.OnAuthenticate = (conContext, sslAuthOptions) =>
            {
                sslAuthOptions.CipherSuitesPolicy = new System.Net.Security.CipherSuitesPolicy(
                    new System.Net.Security.TlsCipherSuite[]
                    {
						// Cipher suits as recommended by: https://wiki.mozilla.org/Security/Server_Side_TLS
						// Listed in preferred order.

						// Highly secure TLS 1.3 cipher suits:
						System.Net.Security.TlsCipherSuite.TLS_AES_128_GCM_SHA256,
                        System.Net.Security.TlsCipherSuite.TLS_AES_256_GCM_SHA384,
                        System.Net.Security.TlsCipherSuite.TLS_CHACHA20_POLY1305_SHA256,

						// Medium secure compatibility TLS 1.2 cipher suits:
						System.Net.Security.TlsCipherSuite.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,
                        System.Net.Security.TlsCipherSuite.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
                        System.Net.Security.TlsCipherSuite.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,
                        System.Net.Security.TlsCipherSuite.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
                        System.Net.Security.TlsCipherSuite.TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,
                        System.Net.Security.TlsCipherSuite.TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,
                        System.Net.Security.TlsCipherSuite.TLS_DHE_RSA_WITH_AES_128_GCM_SHA256,
                        System.Net.Security.TlsCipherSuite.TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
                    }
                    );
            };
        }
    });

    //TODO: sol: these ports need to be in the appSettings file
    options.Listen(IPAddress.Any, 8080); // HTTP
    options.Listen(IPAddress.Any, 8081, listenOptions =>
    {
        listenOptions.UseHttps(certsPath, password);
    });
});


Startup.Configure(builder.Environment);

var AllowSpecificOrigin = Startup.AppSettingManager.GetSection("appSettings:AllowSpecificOrigin").Get<List<String>>();

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins(AllowSpecificOrigin.ToArray<string>())
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddDistributedMemoryCache();

// ASP.NET Core Request length limit
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = int.MaxValue;
});
builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = int.MaxValue; // if don't set default value is: 30 MB
});

// Form's MultipartBodyLengthLimit
builder.Services.Configure<FormOptions>(options =>
 {
     options.ValueLengthLimit = int.MaxValue;
     options.MultipartBodyLengthLimit = int.MaxValue; // if don't set default value is: 128 MB
     options.MultipartHeadersLengthLimit = int.MaxValue;
 });

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(24);
});

builder.Services.AddMvc(config =>
{
    config.Filters.Add(new WebApiExceptionFilter());
});

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
    options.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.Objects;
    options.SerializerSettings.Converters.Add(new StringEnumConverter
    {
        NamingStrategy = new CamelCaseNamingStrategy
        {
            OverrideSpecifiedNames = true
        }
    });
}).AddJsonOptions(options =>
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "KaazingChatApi",
        Version = "v1",
        Description = "This is ASP.NET Core RESTful KaazingChat WebAPI.",
        Contact = new OpenApiContact
        {
            Name = "Leon Li",
        }
    }
    );

    //使用Swagger 進行驗證
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "JWT Authentication",
        Description = "Enter JWT Bearer token **_only_**",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };
    c.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { securityScheme, new string[] { } }
                });

    var filePath = Path.Combine(AppContext.BaseDirectory, "KaazingChatApi.xml");    //專案>建置>輸出>文件檔案:產出包含專案公用API文件的檔案的預設路徑位置=AppContext.BaseDirectory
    c.IncludeXmlComments(filePath, includeControllerXmlComments: true);
    //c.EnableAnnotations();  //Controller檔中使用 SwaggerResponse 方式時,需此行程式碼
    //add the ENUM types to the Swagger Document
    c.SchemaFilter<KaazingChatApi.Utility.EnumTypesSchemaFilter>(filePath);
});

//使用傳統路由方式時,需加入Package "Swashbuckle.AspNetCore.SwaggerGen.ConventionalRouting",
//並使用下列程式碼讓swagger產生器使用傳統路由
builder.Services.AddSwaggerGenWithConventionalRoutes(options =>
{
    options.IgnoreTemplateFunc = (template) => template.StartsWith("api/");
    options.SkipDefaults = true;
});

// For Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(Startup.AppSettingManager.GetConnectionString("default")));

// For Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();

// Adding Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})

// Adding Jwt Bearer
.AddJwtBearer(options =>
             {
                 options.SaveToken = true;
                 options.RequireHttpsMetadata = false;
                 options.TokenValidationParameters = new TokenValidationParameters()
                 {
                     ValidateIssuer = true,
                     ValidateAudience = true,
                     ValidateLifetime = true,
                     ValidateIssuerSigningKey = true,
                     ClockSkew = TimeSpan.Zero,

                     ValidAudience = Startup.AppSettingManager.GetSection("JWT:ValidAudience").Value,
                     ValidIssuer = Startup.AppSettingManager.GetSection("JWT:ValidIssuer").Value,
                     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Startup.AppSettingManager.GetSection("JWT:Secret").Value))
                 };
             });

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSession();

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseCors("AllowSpecificOrigin");

app.UseAuthentication();
app.UseAuthorization();

//下面使用傳統路由方式時,Controller程式檔需拿掉Route屬性程式的引用，
//並配合使用Package "Swashbuckle.AspNetCore.SwaggerGen.ConventionalRouting"
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "KaazingChatWebApi/api/{controller}/{action}/{id?}");

    // Pass the conventional routes to the generator
    ConventionalRoutingSwaggerGen.UseRoutes(endpoints);
});

app.MapControllers();

app.Run();
