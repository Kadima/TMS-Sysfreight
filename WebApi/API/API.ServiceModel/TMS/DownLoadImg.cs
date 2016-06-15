using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using ServiceStack;
using ServiceStack.ServiceHost;
using ServiceStack.OrmLite;
using WebApi.ServiceModel.Tables;
using System.IO;
using System.Drawing;
using System.Runtime.Serialization.Formatters.Binary;

namespace WebApi.ServiceModel.TMS
{
    [Route("/tms/tobk1/doc", "Get")]                // doc?JobNo=
    [Route("/tms/tobk1/attach", "Get")]	// attach?JobNo=
    public  class DownLoadImg : IReturn<CommonResponse>
    {
        public string JobNo { get; set; }

    }

    public class DownLoadImg_Logic
    {
        public IDbConnectionFactory DbConnectionFactory { get; set; }
        public struct JobNoAttachName
        {
            public string Key;
            public string FileName;
            public string Extension;
        }
        private List<JobNoAttachName> jan = null;
        private void SortAsFileCreationTime(ref FileInfo[] arrFi)
        {
            Array.Sort<FileInfo>(arrFi, delegate (FileInfo x, FileInfo y) { return y.CreationTime.CompareTo(x.CreationTime); });
        }
        public void GetAllDirList(string strPath)
        {
            try
            {
                if (Directory.Exists(strPath))
                {
                    DirectoryInfo di = new DirectoryInfo(strPath);
                    DirectoryInfo[] diA = di.GetDirectories();
                    if (diA.Length > 0)
                    {
                        for (int i = 0; i <= diA.Length - 1; i++)
                        {
                            JobNoAttachName tnn = new JobNoAttachName();
                            tnn.Key = diA[i].Name;
                            FileInfo[] arrFi = diA[i].GetFiles();
                            if (arrFi.Length > 0)
                            {
                                SortAsFileCreationTime(ref arrFi);
                                tnn.FileName = arrFi[0].Name;
                                tnn.Extension = arrFi[0].Extension;
                            }
                            else
                            {
                                tnn.FileName = "";
                                tnn.Extension = "";
                            }
                            jan.Add(tnn);
                            GetAllDirList(diA[i].FullName);
                        }
                    }
                    else
                    {
                        JobNoAttachName tnn = new JobNoAttachName();
                        tnn.Key = di.Name;
                        FileInfo[] arrFi = di.GetFiles();
                        if (arrFi.Length > 0)
                        {
                            SortAsFileCreationTime(ref arrFi);
                            tnn.FileName = arrFi[0].Name;
                            tnn.Extension = arrFi[0].Extension;
                        }
                        else
                        {
                            tnn.FileName = "";
                            tnn.Extension = "";
                        }
                        jan.Add(tnn);
                    }
                }
            }
            catch { throw; }
        }
        public string Get_Jmjm1_Attach_List(DownLoadImg request)
        {
            string Result = null;
            jan = new List<JobNoAttachName>();
            string strPath = "";
            string DocumentPath = "";
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection())
                {
                    string strSQL = "Select Top 1 DocumentPath From Saco1";
                    List<Saco1> saco1 = db.Select<Saco1>(strSQL);
                    if (saco1.Count > 0)
                    {
                        DocumentPath = saco1[0].DocumentPath;
                    }
                }
                //strPath = DocumentPath + "\\Tobk1\\" + request.JobNo;
            //   GetAllDirList(strPath);
          
            
              // DocumentPath = "E:\\Sysfreight";
              strPath = DocumentPath + "\\Tobk1\\" + request.JobNo+"\\"+ "signature.png";
                //strPath = DocumentPath + "\\Tobk1\\" + request.JobNo;
                using (FileStream fsRead = new FileStream(strPath, FileMode.Open))
                {
                    int fsLen = (int)fsRead.Length;
                    Image img = Image.FromStream(fsRead);
                    //BinaryFormatter binFormatter = new BinaryFormatter();
                    //MemoryStream memStream = new MemoryStream();
                    //binFormatter.Serialize(memStream, img);
                    //byte[] bytes = memStream.GetBuffer();
                    //string base64 = Convert.ToBase64String(bytes);            
                    //Result = base64;
                    MemoryStream ms = new MemoryStream();
                    byte[] imagedata = null;
                    img.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    imagedata = ms.GetBuffer();
                    Result= Convert.ToBase64String(imagedata);
                
                }

            }
            catch { throw; }
            return Result;
        }
      
        public List<Tobk1> Get_Jmjm1_Doc_List(DownLoadImg request)
        {
            List<Tobk1> Result = null;
            try
            {
                using (var db = DbConnectionFactory.OpenDbConnection())
                {
                    string strSQL = "SELECT Top 1 JobNo " +
                                    "FROM Tobk1 Where JobNo='" + request.JobNo + "' And IsNull(StatusCode,'')<>'DEL'";
                    Result = db.Select<Tobk1>(strSQL);
                }
            }
            catch { throw; }
            return Result;
        }
    }

}
