
// 默认向外暴露出一个对象
module.exports={
    chainWebpack:config=>{
        // 发布模式
        config.when(process.env.NODE_ENV === 'production',config=>{
            config.entry('app').clear().add('./src/main-prod.js');

            // 使用externals设置排除项
            config.set('externals',{
                vue:'Vue',
                'vue-router':'VueRouter',
                axios:'axios',
                lodash:'_',
                moment:'moment',
                echarts:'echarts',
                Nprogress:'NProgress',
                'vue-quill-editor':'VueQuillEditor'
            })
            config.plugin('html').tap(args=>{
                // 给html新增一个属性isProd
               args[0].isProd = true; 
               return args;
            })
        })  
        // 开发模式
        config.when(process.env.NODE_ENV === 'development',config=>{
            config.entry('app').clear().add('./src/main-dev.js');
            config.plugin('html').tap(args=>{
                args[0].isProd = false; 
                return args;
             })
        })  
    }
}