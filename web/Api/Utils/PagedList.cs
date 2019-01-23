using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;

namespace Api.Utils
{
    public class PagedList
    {
        public int current { get; set; }
        public List<int> pages { get; set; }
        public List<object> list { get; set; }

        public void ReplaceList(List<object> replacement)
        {
            list = replacement;
        }

        public static PagedList Create(string pageStr, int pagesize, IOrderedQueryable<object> list)
        {
            PagedList pagedList = new PagedList();
            int page = 0;
            if (pageStr != "")
            {
                page = Convert.ToInt32(pageStr);
            }

            page = page - 1;
            int total = list.Count();
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

            while (pagedList.pages.Count != lastcount && pagedList.pages.Count < 5 && pagedList.pages.Count > 0)
            {
                lastcount = pagedList.pages.Count;
                pagedList.pages.Insert(0, pagedList.pages.First() - 1);
                pagedList.pages.Add(pagedList.pages.Last() + 1);
                pagedList.pages.RemoveAll(p => p <= 0);
                pagedList.pages.RemoveAll(p => p > maxPages);
            }

            pagedList.list = list.Skip(page * pagesize).Take(pagesize).ToList();

            return pagedList;
        }
    }

    public static class LinqExtension
    {
        public static bool IsOrdered<T>(this IQueryable<T> queryable)
        {
            if (queryable == null)
            {
                throw new ArgumentNullException("queryable");
            }

            return queryable.Expression.Type == typeof(IOrderedQueryable<T>);
        }
        public static IQueryable<T> OrderByField<T>(this IQueryable<T> q, string SortField, bool Ascending)
        {
            var param = Expression.Parameter(typeof(T), "p");
            var prop = Expression.Property(param, SortField);
            var exp = Expression.Lambda(prop, param);
            string method = Ascending ? "OrderBy" : "OrderByDescending";
            Type[] types = new Type[] { q.ElementType, exp.Body.Type };
            var mce = Expression.Call(typeof(Queryable), method, types, q.Expression, exp);
            return q.Provider.CreateQuery<T>(mce);
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