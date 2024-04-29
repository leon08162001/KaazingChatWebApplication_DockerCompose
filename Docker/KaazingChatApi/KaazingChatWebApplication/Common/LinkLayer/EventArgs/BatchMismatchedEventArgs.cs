﻿using System;

namespace Common.LinkLayer
{
    /// <summary>
    /// MessageHeader's Count與MessageBody's DataRow Count不符合事件參數類別
    /// </summary>
    public class BatchMismatchedEventArgs : EventArgs
    {
        private string _MismatchedMessage;
        public BatchMismatchedEventArgs()
        {
            _MismatchedMessage = "";
        }
        public BatchMismatchedEventArgs(string MismatchedMessage)
        {
            _MismatchedMessage = MismatchedMessage;
        }
        public string MismatchedMessage
        {
            get { return _MismatchedMessage; }
            set { _MismatchedMessage = value; }
        }
    }
}
