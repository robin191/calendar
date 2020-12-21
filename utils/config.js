// var fileHost = "https://zhubg.oss-cn-beijing.aliyuncs.com/";// 你的阿里云地址最后面跟上一个/   在你当前小程序的后台的uploadFile 合法域名也要配上这个域名
var fileHost = "https://yitu-file.oss-cn-hangzhou.aliyuncs.com/";// 你的阿里云地址最后面跟上一个/   在你当前小程序的后台的uploadFile 合法域名也要配上这个域名

var config = {
   //aliyun OSS config
  uploadImageUrl: `${fileHost}`, // 默认存在根目录，可根据需求改
  AccessKeySecret: 'AP5TVT3gTojBWKgjGhKzPYDm0sRZFw',        // AccessKeySecret 去你的阿里云上控制台上找  u2ZURE51U06LPCNoIZ3Zem1UjHSlIL
  OSSAccessKeyId: 'LTAI4FhwgmpbBqTpHqNZxRAd',       // AccessKeyId 去你的阿里云上控制台上找   LTAI4Fmh9j4Ns6KZfj8kzsNx
   timeout: 87600 //这个是上传文件时Policy的失效时间
};
module.exports = config