namespace AutoPalyApp
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            webView21 = new Microsoft.Web.WebView2.WinForms.WebView2();
            menuStrip1 = new MenuStrip();
            menuStrip1_Item1 = new ToolStripMenuItem();
            menuStrip1_Item1_SubItem1 = new ToolStripMenuItem();
            menuStrip1_Item2 = new ToolStripMenuItem();
            menuStrip1_Item3 = new ToolStripMenuItem();
            menuStrip1_Item1_SubItem2 = new ToolStripMenuItem();
            ((System.ComponentModel.ISupportInitialize)webView21).BeginInit();
            menuStrip1.SuspendLayout();
            SuspendLayout();
            // 
            // webView21
            // 
            webView21.AllowExternalDrop = true;
            webView21.CreationProperties = null;
            webView21.DefaultBackgroundColor = Color.White;
            webView21.Dock = DockStyle.Fill;
            webView21.Location = new Point(0, 25);
            webView21.Name = "webView21";
            webView21.Size = new Size(800, 425);
            webView21.TabIndex = 0;
            webView21.ZoomFactor = 1D;
            webView21.WebMessageReceived += webView21_WebMessageReceived;
            // 
            // menuStrip1
            // 
            menuStrip1.Items.AddRange(new ToolStripItem[] { menuStrip1_Item1, menuStrip1_Item2, menuStrip1_Item3 });
            menuStrip1.Location = new Point(0, 0);
            menuStrip1.Name = "menuStrip1";
            menuStrip1.Size = new Size(800, 25);
            menuStrip1.TabIndex = 1;
            menuStrip1.Text = "菜单导航";
            // 
            // menuStrip1_Item1
            // 
            menuStrip1_Item1.DropDownItems.AddRange(new ToolStripItem[] { menuStrip1_Item1_SubItem1, menuStrip1_Item1_SubItem2 });
            menuStrip1_Item1.Name = "menuStrip1_Item1";
            menuStrip1_Item1.Size = new Size(44, 21);
            menuStrip1_Item1.Text = "操作";
            // 
            // menuStrip1_Item1_SubItem1
            // 
            menuStrip1_Item1_SubItem1.Name = "menuStrip1_Item1_SubItem1";
            menuStrip1_Item1_SubItem1.Size = new Size(180, 22);
            menuStrip1_Item1_SubItem1.Text = "配置模拟器";
            menuStrip1_Item1_SubItem1.Click += menuStrip1_Item1_SubItem1_Click;
            // 
            // menuStrip1_Item2
            // 
            menuStrip1_Item2.Alignment = ToolStripItemAlignment.Right;
            menuStrip1_Item2.Name = "menuStrip1_Item2";
            menuStrip1_Item2.Size = new Size(44, 21);
            menuStrip1_Item2.Text = "退出";
            menuStrip1_Item2.Click += menuStrip1_Item2_Click;
            // 
            // menuStrip1_Item3
            // 
            menuStrip1_Item3.Alignment = ToolStripItemAlignment.Right;
            menuStrip1_Item3.Name = "menuStrip1_Item3";
            menuStrip1_Item3.Size = new Size(68, 21);
            menuStrip1_Item3.Text = "重新启动";
            menuStrip1_Item3.Click += menuStrip1_Item3_Click;
            // 
            // menuStrip1_Item1_SubItem2
            // 
            menuStrip1_Item1_SubItem2.Name = "menuStrip1_Item1_SubItem2";
            menuStrip1_Item1_SubItem2.Size = new Size(180, 22);
            menuStrip1_Item1_SubItem2.Text = "配置端口";
            menuStrip1_Item1_SubItem2.Click += menuStrip1_Item1_SubItem2_Click;
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(7F, 17F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(800, 450);
            Controls.Add(webView21);
            Controls.Add(menuStrip1);
            MainMenuStrip = menuStrip1;
            Name = "Form1";
            Text = "Form1";
            Load += Form1_Load;
            ((System.ComponentModel.ISupportInitialize)webView21).EndInit();
            menuStrip1.ResumeLayout(false);
            menuStrip1.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Microsoft.Web.WebView2.WinForms.WebView2 webView21;
        private MenuStrip menuStrip1;
        private ToolStripMenuItem menuStrip1_Item1;
        private ToolStripMenuItem menuStrip1_Item2;
        private ToolStripMenuItem menuStrip1_Item3;
        private ToolStripMenuItem menuStrip1_Item1_SubItem1;
        private ToolStripMenuItem menuStrip1_Item1_SubItem2;
    }
}
