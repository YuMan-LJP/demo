using AutoMapper;
using AutoMapper.QueryableExtensions;
using AutoPalyApp.Core.Entity;

namespace AutoPalyApp.Core.Dto
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
                cfg.CreateMap<MyCommandGroup, MyCommandGroupDto>().ForMember(f => f.Commands, options => options.Ignore());
                cfg.CreateMap<MyCommand, MyCommandDto>().ForMember(f => f.Commands, options => options.Ignore());
                cfg.CreateMap<MyJobInfo, MyJobInfoDto>().ForMember(f => f.Triggers, options => options.Ignore());
            });
            return config;
        }

        public static IQueryable<TDestination> ProjectToEx<TDestination>(this IQueryable source, object parameters = null)
        {
            return source.ProjectTo<TDestination>(Get(), parameters);
        }

        public static TDestination MapEx<TDestination>(this object source)
        {
            return Get().CreateMapper().Map<TDestination>(source);
        }
    }
}
