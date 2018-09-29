using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Api.Utils
{
    public class PagedList
    {
        public int current { get; set; }
        public List<int> pages { get; set; }
        public List<object> list { get; set; }
        public static PagedList create(string pageStr, int pagesize, IEnumerable<object> list)
        {
            PagedList pagedList = new PagedList();
            try
            {
                int page = 0;
                if (pageStr != "")
                {
                    page = Convert.ToInt32(pageStr);
                }

                page = page - 1;
                int total = (list as IList).Count;
                int maxPages = (int)Math.Ceiling((double)total / (double)pagesize);
                if (page >= maxPages)
                {
                    page = maxPages - 1;
                }
                if (page < 0)
                {
                    page = 0;
                }

                pagedList.pages = new List<int>();
                pagedList.current = page + 1;

                int lastcount = 0;
                pagedList.pages.Add(pagedList.current);
                while (pagedList.pages.Count != lastcount && pagedList.pages.Count < 5)
                {
                    lastcount = pagedList.pages.Count;
                    pagedList.pages.Insert(0, pagedList.pages.First() - 1);
                    pagedList.pages.Add(pagedList.pages.Last() + 1);
                    pagedList.pages.RemoveAll(p => p <= 0);
                    pagedList.pages.RemoveAll(p => p > maxPages);
                }

                pagedList.list = (list as IEnumerable<object>).Skip(page * pagesize).Take(pagesize).ToList();
                return pagedList;
            }
            catch (Exception)
            {
                pagedList.current = 1;
                pagedList.pages = new List<int>();

                pagedList.list = new List<object>();
                foreach (var obj in (list as IEnumerable<object>))
                {
                    pagedList.list.Add(obj);
                }

                return pagedList;
            }
        }
    }
    public class DTPagedList
    {
        public int current { get; set; }
        public List<int> pages { get; set; }
        public object[] rows { get; set; }
        public string[] columns { get; set; }

        public static DTPagedList create(string pageStr, int pagesize, DataTable table)
        {
            DTPagedList pagedList = new DTPagedList();
            try
            {
                int page = 0;
                if (pageStr != "")
                {
                    page = Convert.ToInt32(pageStr);
                }

                page = page - 1;
                int total = table.Rows.Count;
                int maxPages = (int)Math.Ceiling((double)total / (double)pagesize);
                if (page >= maxPages)
                {
                    page = maxPages - 1;
                }
                if (page < 0)
                {
                    page = 0;
                }

                pagedList.pages = new List<int>();
                pagedList.current = page + 1;

                int lastcount = 0;
                pagedList.pages.Add(pagedList.current);
                while (pagedList.pages.Count != lastcount && pagedList.pages.Count < 5)
                {
                    lastcount = pagedList.pages.Count;
                    pagedList.pages.Insert(0, pagedList.pages.First() - 1);
                    pagedList.pages.Add(pagedList.pages.Last() + 1);
                    pagedList.pages.RemoveAll(p => p <= 0);
                    pagedList.pages.RemoveAll(p => p > maxPages);
                }

                pagedList.columns = table.Columns.Cast<DataColumn>().ToList().ConvertAll(col => col.ColumnName).ToArray();
                pagedList.rows = table.Rows.Cast<DataRow>().Skip(page * pagesize).Take(pagesize).ToList().ConvertAll<object>(i => i.ItemArray).ToArray();
                return pagedList;
            }
            catch (Exception)
            {
                return pagedList;
            }
        }
    }

}