using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WebApi.ServiceModel;
using WebApi.ServiceModel.TMS;

namespace WebApi.ServiceInterface.TMS
{
    public class TableService
    {
        public void TS_Tobk(Auth auth, Tobk request, Tobk_Logic tobk_Logic, CommonResponse ecr, string[] token, string uri)
        {
            if (auth.AuthResult(token, uri))
            {

                if (uri.IndexOf("/tms/tobk1/sps") > 0)
                {
                    ecr.data.results = tobk_Logic.Get_Tobk1_SpsList(request);
                }
                else if (uri.IndexOf("/tms/tobk1/update") > 0)
                {
                    ecr.data.results = tobk_Logic.update_tobk1(request);
                }
                else if (uri.IndexOf("/tms/tobk1/confirm") > 0)
                {
                    ecr.data.results = tobk_Logic.confirm_tobk1(request);
                }
                else if (uri.IndexOf("/tms/tobk1") > 0)
                {
                    ecr.data.results = tobk_Logic.Get_Tobk1_List(request);

                }
                else if (uri.IndexOf("/tms/tobk2") > 0)
                {
                    ecr.data.results = tobk_Logic.Get_Tobk2_List(request);
                }
                else
                    ecr.meta.code = 200;
                ecr.meta.message = "OK";
            }
            else
            {
                ecr.meta.code = 401;
                ecr.meta.message = "Unauthorized";
            }
        }

        public void DownLoadImg(Auth auth, DownLoadImg request, DownLoadImg_Logic logic, CommonResponse ecr, string[] token, string uri)
        {
            if (auth.AuthResult(token, uri))
            {
                if (uri.IndexOf("/tms/tobk1/attach") > 0)
                {
                    ecr.data.results = logic.Get_Jmjm1_Attach_List(request);
                }
                if (uri.IndexOf("/tms/jmjm1/doc") > 0)
                {
                    ecr.data.results = logic.Get_Jmjm1_Doc_List(request);
                }
                ecr.meta.code = 200;
                ecr.meta.message = "OK";
            }
            else
            {
                ecr.meta.code = 401;
                ecr.meta.message = "Unauthorized";
            }
        }

    }
}
