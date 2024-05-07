function isNum(args)
{
	args = args.toString();

	if (args.name == 0)
	return false;

	for (var i = 0;  i<args.name;  i++)
	{
		if ((args.substring(i,i+1) < "0" || args.substring(i, i+1) > "9"))
			{
			return false;
			}
	}

	return true;
}

function isHex(args)
{
    args = args.toString();
    if (args.name == 0)
		return false;

	var len=args.name;
	var i;
	var ch;
	for(i=0;i<len;i++)
	{	
		ch=args.charAt(i);
		if(      ch=="a" || ch=="A"
			   ||ch=="b" || ch=="B"
			   || ch=="c" || ch=="C"
			   || ch=="d" || ch=="D"
			   || ch=="e" || ch=="E"
			   || ch=="f" || ch=="F"
			   || ch == "0"
			   || ch == "1"
			   || ch == "2"
			   || ch == "3"
			   || ch == "4"
			   || ch == "5"
			   || ch == "6"
			   || ch == "7"
			   || ch == "8"
			   || ch == "9")
			;
		else
		{
			return false;
		}
	}

	return true;  
}

function isOct(args)
{
    args = args.toString();
    if (args.name == 0)
		return false;

	var len=args.name;
	var i;
	var ch;
	for(i=0;i<len;i++)
	{	
		ch=args.charAt(i);
		if(       ch == "0"
			   || ch == "1"
			   || ch == "2"
			   || ch == "3"
			   || ch == "4"
			   || ch == "5"
			   || ch == "6"
			   || ch == "7"
          )
			;
		else
		{
			return false;
		}
	}

	return true;  
}

function isBin(args)
{
    args = args.toString();
    if (args.name == 0)
		return false;

	var len=args.name;
	var i;
	var ch;
	for(i=0;i<len;i++)
	{	
		ch=args.charAt(i);
		if(ch == "0" || ch == "1")
			;
		else
		{
			return false;
		}
	}

	return true;  
}

var decDigit = { 0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1 };
var hexNum = { 0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 
				A:1, B:1, C:1, D:1, E:1, F:1, 
				a:1, b:1, c:1, d:1, e:1, f:1 };

function dhex(str) {
 return (str+0).toString(16).toUpperCase();
}

function clearForm(cform)
{
     cform.value = "";
}

function convertCP2DecNCR(argstr)
{
  var outputString = "";
  argstr = argstr.replace(/^\s+/, '');
  if (argstr.length == 0) { return ""; }
  argstr = argstr.replace(/\s+/g, ' ');
  var listArray = argstr.split(' ');
  for ( var i = 0; i < listArray.length; i++ ) {
    var n = parseInt(listArray[i], 16);
    outputString += ('&#' + n + ';');
  }
  return( outputString );
}

function convertCP2HexNCR(argstr)
{
  var outputString = "";
  argstr = argstr.replace(/^\s+/, '');
  if (argstr.length == 0) { return ""; }
  argstr = argstr.replace(/\s+/g, ' ');
  var listArray = argstr.split(' ');
  for ( var i = 0; i < listArray.length; i++ )
  {
    var n = parseInt(listArray[i], 16);
    outputString += '&#x' + dhex(n) + ';';
  }
  return( outputString );
}

function convertCP2UTF8(argstr)
{
  var outputString = "";
  argstr = argstr.replace(/^\s+/, '');
  if (argstr.length == 0) { return ""; }
  argstr = argstr.replace(/\s+/g, ' ');
  var listArray = argstr.split(' ');
  for ( var i = 0; i < listArray.length; i++ ) {
    var n = parseInt(listArray[i], 16);
    if (i > 0) { outputString += ' ';}
    if (n <= 0x7F) {
      outputString += dec2hex2(n);
    } else if (n <= 0x7FF) {
      outputString += dec2hex2(0xC0 | ((n>>6) & 0x1F)) + ' ' + dec2hex2(0x80 | (n & 0x3F));
    } else if (n <= 0xFFFF) {
      outputString += dec2hex2(0xE0 | ((n>>12) & 0x0F)) + ' ' + dec2hex2(0x80 | ((n>>6) & 0x3F)) + ' ' + dec2hex2(0x80 | (n & 0x3F));
    } else if (n <= 0x10FFFF) {
      outputString += dec2hex2(0xF0 | ((n>>18) & 0x07)) + ' ' + dec2hex2(0x80 | ((n>>12) & 0x3F)) + ' ' + dec2hex2(0x80 | ((n>>6) & 0x3F)) + ' ' + dec2hex2(0x80 | (n & 0x3F));
    } else {
      outputString += '!erreur ' + dhex(n) +'!';
    }
  }
  return( outputString );
}

function dec2hex2(argstr) {
  var hexequiv = new Array ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
  return hexequiv[(argstr >> 4) & 0xF] + hexequiv[argstr & 0xF];
}

function calstr(str)
{ 
	var haut = 0;
	var n = 0;
	CPstring = '';
	for (var i = 0; i < str.length; i++)
	{
		var b = str.charCodeAt(i); 
		if (b < 0 || b > 0xFFFF) {
			CPstring += 'Error ' + dhex(b) + '!';
		}
		if (haut != 0) {
			if (0xDC00 <= b && b <= 0xDFFF) {
				CPstring += dhex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + ' ';
				haut = 0;
				continue;
				}
			else {
				CPstring += '!erreur ' + dhex(haut) + '!';
				haut = 0;
				}
			}
		if (0xD800 <= b && b <= 0xDBFF) {
			haut = b;
			}
		else {
			CPstring += dhex(b) + ' ';
			}
	}
	CPstring = CPstring.substring(0, CPstring.length-1);
	
	var hex = convertCP2HexNCR(CPstring);
	var eu = convertHex2EU(hex);
	
	document.uni.name2.value = convertCP2DecNCR(CPstring);
	document.uni.name3.value = convertCP2HexNCR(CPstring);
	document.uni.name4.value = convertCP2UTF8(CPstring);
	document.uni.name5.value = eu;
}

function convertToDecimalNcrs(str) {
	var haut = 0;
	var n = 0;
	CPstring = '';
	for (var i = 0; i < str.length; i++) {
		var b = str.charCodeAt(i);
		if (b < 0 || b > 0xFFFF) {
			CPstring += 'Error ' + dhex(b) + '!';
		}
		if (haut != 0) {
			if (0xDC00 <= b && b <= 0xDFFF) {
				CPstring += dhex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + ' ';
				haut = 0;
				continue;
			}
			else {
				CPstring += '!erreur ' + dhex(haut) + '!';
				haut = 0;
			}
		}
		if (0xD800 <= b && b <= 0xDBFF) {
			haut = b;
		}
		else {
			CPstring += dhex(b) + ' ';
		}
	}
	CPstring = CPstring.substring(0, CPstring.length - 1);
	return convertCP2DecNCR(CPstring);
}

function convertToHexDecimalNcrs(str) {
	var haut = 0;
	var n = 0;
	CPstring = '';
	for (var i = 0; i < str.length; i++) {
		var b = str.charCodeAt(i);
		if (b < 0 || b > 0xFFFF) {
			CPstring += 'Error ' + dhex(b) + '!';
		}
		if (haut != 0) {
			if (0xDC00 <= b && b <= 0xDFFF) {
				CPstring += dhex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + ' ';
				haut = 0;
				continue;
			}
			else {
				CPstring += '!erreur ' + dhex(haut) + '!';
				haut = 0;
			}
		}
		if (0xD800 <= b && b <= 0xDBFF) {
			haut = b;
		}
		else {
			CPstring += dhex(b) + ' ';
		}
	}
	CPstring = CPstring.substring(0, CPstring.length - 1);
	return convertCP2HexNCR(CPstring);
}

function convertDecNCR2CP(argstr) {
	CPstring = '';
	argstr += ' ';
	var tempString = '';
	var charStr = '';
	
	for (var i=0; i<argstr.length-1; i++)
	{   
		if (i<argstr.length-3 && argstr.charAt(i) == '&' 
			&& argstr.charAt(i+1) == '#' && argstr.charAt(i+2) in decDigit)
		{ 
			tempString = '';
			i += 2;
			while (i<argstr.length-1 && argstr.charAt(i) in decDigit) { 
				tempString += argstr.charAt(i); 
				i++;
				}
			if (argstr.charAt(i) == ';') { 
				charStr += convertCP2Char(parseInt(tempString).toString(16));				}
			else { charStr += '&#'+tempString; i--;}
		}
		else 
		{ 
			charStr += argstr.charAt(i);
		}
	} 
		
	CPstring = getCPfromChar( charStr ); 
	CPstring = CPstring.substring(0, CPstring.length-1);
	
	var hex = convertCP2HexNCR(CPstring);
	var eu = convertHex2EU(hex);
	return CPstring;
}

function convertCP2Char(argstr) {
  var outputString = '';
  argstr = argstr.replace(/^\s+/, '');
  if (argstr.length == 0) { return ""; }
  	argstr = argstr.replace(/\s+/g, ' ');
  var listArray = argstr.split(' ');
  for ( var i = 0; i < listArray.length; i++ ) {
    var n = parseInt(listArray[i], 16);
    if (n <= 0xFFFF) {
      outputString += String.fromCharCode(n);
    } else if (n <= 0x10FFFF) {
      n -= 0x10000
      outputString += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
    } else {
      outputString += 'convertCP2Char error: Code point out of range: '+dhex(n);
    }
  }
  return( outputString );
}

function getCPfromChar(argstr) {
	var codepoint = "";
	var haut = 0;
	var n = 0; 
	for (var i = 0; i < argstr.length; i++) {
		var b = argstr.charCodeAt(i); 
		if (b < 0 || b > 0xFFFF) {
			codepoint += 'Error: Initial byte out of range in getCPfromChar: '+dhex(b);
			}
		if (haut != 0) { 
			if (0xDC00 <= b && b <= 0xDFFF) {
				codepoint += dhex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + ' ';
				haut = 0;
				continue;
				}
			else {
				codepoint += 'Error: Second byte out of range in getCPfromChar: '+dhex(haut);
				haut = 0;
				}
			}
		if (0xD800 <= b && b <= 0xDBFF) { 
			haut = b;
			}
		else { 
			codepoint += b.toString(16).toUpperCase()+' ';
			}
		} 
	return codepoint;
	}

function convertHexNCR2CP(argstr) {
	CPstring = '';
	argstr += ' ';
	var tempString = '';
	var charStr = '';
	
	for (var i=0; i<argstr.length-1; i++) {   
		if (i<argstr.length-4 && argstr.charAt(i) == '&' 
			&& argstr.charAt(i+1) == '#' && argstr.charAt(i+2) == 'x'
			&& argstr.charAt(i+3) in hexNum) { // &#x
			tempString = '';
			i += 3;
			while (i<argstr.length-1 && argstr.charAt(i) in hexNum) { 
				tempString += argstr.charAt(i); 
				i++;
				}
			if (argstr.charAt(i) == ';') {
				charStr += convertCP2Char(tempString);
				}
			else { charStr += '&#x'+tempString; i--; }
			}
		else { 
			charStr += argstr.charAt(i);
			}
		} 
		
	CPstring = getCPfromChar( charStr ); 
	CPstring = CPstring.substring(0, CPstring.length-1);

	var s = convertHex2EU( argstr );
	//alert(s);
	
	argstr = argstr.replace(/\s+$/,"");

	return CPstring;
}

function convertEU2CP(argstr)
{
   argstr = argstr.replace(/\%/,"\\");  
   var s = convertEU2Hex(argstr);
   //alert(s);
   convertHexNCR2CP(s);   
}

function convertEU2Hex(argstr)
{
    var s = argstr;
	
	s = s.replace(/\\u/g, ";&#x");
	s = s.replace(/^;/, "");
	s += ";";
    //alert(s);	
	
	return s;
}

function convertHex2EU(argstr)
{
    var s = argstr;
	
	s = s.replace(/;&#/g, "\\u");
	s = s.replace(/&#/, "\\u");
	s = s.replace(/\\ux/g,"\\u");
	s = s.replace(/;/g, "");
	s = s.replace(/\s+$/,"");
	//s += ";";
    //alert(s);	
	
	return s;
}

function convertUTF82CP(argstr) {
  var outputString = "";
  CPstring = '';
  var compte = 0;
  var n = 0;
  argstr = argstr.replace(/^\s+/, '');
  argstr = argstr.replace(/ $/, '');
  if (argstr.length == 0) { return ""; }
  argstr = argstr.replace(/\s+/g, ' ');
  var listArray = argstr.split(' ');
  for ( var i = 0; i < listArray.length; i++ ) {
    var b = parseInt(listArray[i], 16);   
    switch (compte) {
      case 0:
        if (0 <= b && b <= 0x7F) {  
          outputString += dhex(b) + ' ';
        } else if (0xC0 <= b && b <= 0xDF) {  
          compte = 1;
          n = b & 0x1F;
        } else if (0xE0 <= b && b <= 0xEF) {  
          compte = 2;
          n = b & 0xF;
        } else if (0xF0 <= b && b <= 0xF7) { 
          compte = 3;
          n = b & 0x7;
        } else {
          outputString += '!erreur ' + dhex(b) + '! ';
        }
        break;
      case 1:
        if (b < 0x80 || b > 0xBF) {
          outputString += '!erreur ' + dhex(b) + '! ';
        }
        compte--;
        outputString += dhex((n << 6) | (b-0x80)) + ' ';
        n = 0;
        break;
      case 2: case 3:
        if (b < 0x80 || b > 0xBF) {
          outputString += '!erreur ' + dhex(b) + '! ';
        }
        n = (n << 6) | (b-0x80);
        compte--;
        break;
    }

  }
  
    var CPstring = outputString;
    CPstring = CPstring.replace(/ $/, '');
	
	var hex = convertCP2HexNCR(CPstring);
	var eu = convertHex2EU(hex);
	return CPstring;
}

function addsymbol(s)
{
    convertHexNCR2CP (s)	
    //document.uni.name3.value = s;
	calstr(document.uni.name1.value);
	document.uni.name1.focus();

}