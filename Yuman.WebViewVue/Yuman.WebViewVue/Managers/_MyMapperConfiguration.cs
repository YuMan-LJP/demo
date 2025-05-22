using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Yuman.WebViewVue.Managers
{
    public static class _MyMapperConfiguration
    {
        /// <summary>
        /// 全局的映射直接在这里配置即可
        /// </summary>
        /// <returns></returns>
        public static MapperConfiguration Get()
        {
            var config = new MapperConfiguration(cfg =>
            {
                //cfg.CreateMap<MyCommandGroup, MyCommandGroupDto>().ForMember(f => f.Tree, options => options.Ignore());
                //cfg.CreateMap<MyJobInfo, MyJobInfoDto>().ForMember(f => f.Triggers, options => options.Ignore());
            });
            return config;
        }

        public static IQueryable<TDestination> ProjectToEx<TDestination>(this IQueryable source, object? parameters = null)
        {
            return source.ProjectTo<TDestination>(Get(), parameters);
        }

        public static TDestination MapEx<TDestination>(this object source)
        {
            return Get().CreateMapper().Map<TDestination>(source);
        }
    }
}
