// 模拟我们的服务器
// 使用 Mock 来拦截请求

// 学生数据模版
const template = {
    'stuId|+1': 1,
    'stuName': '@cname',
    'stuGender': /[男女]/,
    'stuEmail': /^[\w\.-_]+@[\w-_]+\.com$/,
    'stuAge|20-30': 1,
    'stuTel': /^1[385][1-9]\d{8}/,
    'stuAddr': '@city',
}

// Mock.mock(要拦截的请求地址,回调函数)
Mock.mock('/getStuData/',function(){
    return Mock.mock({
        "status" : "success",
        "msg" : "成功获取数据",
        "data|2" : [template]
    })
})

// 随机生成一条学生数据
Mock.mock('/addStuRandom/', function(){
    // 模拟服务器，新增一条随机数据，并返回这条随机数据
    const newStu = Mock.mock({
        'list' : template
    })
    let stuData = JSON.parse(localStorage.stuData);
    if(stuData.length == 0){
        newStu.list.stuId = 1;
    }else{
        newStu.list.stuId = stuData[stuData.length - 1].stuId + 1;
    }
    return newStu.list;
})

function queryToObj(queryStr){
    var result = {};
    var queryArr = queryStr.split('&');
    for(var i of queryArr){
        var key = i.split('=')[0];
        var val = i.split('=')[1];
        result[key]=val;
    }
    return result;
}

//手动新增学生数据
Mock.mock('/addStuByForm/','post',function(option){
    var newStu = queryToObj(decodeURIComponent(option.body));
    // 这里正常的逻辑，应该是连接数据库进行存储，返回新增成功的信息
    var stuData = JSON.parse(localStorage.stuData);
    if(stuData.length == 0){
        newStu.stuId = 1;
    }else{
        newStu.stuId = parseInt(stuData[stuData.length - 1].stuId) + 1;
    }
    return newStu;
})

//根据id获取学生数据，并返回
Mock.mock('/getOneStuInfo/','post',function(option){
    //获取客户端传递过来的id
    var id =queryToObj(decodeURIComponent(option.body)).id;
    // 这里正常的逻辑，应该连接后端数据库，获取对应 id 的学生数据
    var stuData = JSON.parse(localStorage.stuData);
    var result =stuData.filter(function(item){
        return item.stuId == id;
    })
    return result[0];
})
//修改学生数据
Mock.mock('/editStuByForm/','post',function(option){
    var stuInfo=queryToObj(decodeURIComponent(option.body));
    // 这里正常的逻辑，连接数据库，将新的信息覆盖旧的信息
    var stuData=JSON.parse(localStorage.stuData);
    for(var i=0;i<stuData.length;i++){
        if(stuData[i].stuId == stuInfo.stuId){
             // 说明找到了要修改的那一位学生
            stuData.splice(i,1,stuInfo);
            break;
        }
    }
    return stuData;
})
//删除学生
Mock.mock(RegExp('/delStu/?[\w\W]*'),'delete',function(option){
    var id = option.url.split("/")[2];
    // 这里正常的逻辑，就是应该连接数据库，删除和这个 id 相对应的数据
    var stuData=JSON.parse(localStorage.stuData);
    for(var i=0;i<stuData.length;i++){
        if(stuData[i].stuId == id){
            stuData.splice(i,1);
            break;
        }
    }
    return stuData;
})
//搜索功能
Mock.mock('/searchStu/','post',function(option){
    var stuInfo=queryToObj(decodeURIComponent(option.body));
    // 这里正常逻辑，就应该连接数据库，根据上面 searchInfo 的条件来搜索数据，然后返回给客户端
    var stuData = JSON.parse(localStorage.stuData);
    switch(stuInfo.selectSearchItem){
        case 'stuId': {
            return stuData.filter(function(item){
                return item.stuId == stuInfo.searchContent;
            });
        }
        case 'stuName': {
            return stuData.filter(function(item){
                return item.stuName == stuInfo.searchContent;
            });
        }
        case 'stuGender': {
            return stuData.filter(function(item){
                return item.stuGender == stuInfo.searchContent;
            });
        }
        case 'stuEmail': {
            return stuData.filter(function(item){
                return item.stuEmail == stuInfo.searchContent;
            });
        }
        case 'stuAge': {
            return stuData.filter(function(item){
                return item.stuAge == stuInfo.searchContent;
            });
        }
        case 'stuTel': {
            return stuData.filter(function(item){
                return item.stuTel == stuInfo.searchContent;
            });
        }
        case 'stuAddr': {
            return stuData.filter(function(item){
                return item.stuAddr == stuInfo.searchContent;
            });
        }
    }
})