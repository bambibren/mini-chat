<template>
    <div id="app">
        <!-- 迷你 -->
        <div id="mini" :class="['transition',{hidebtn:isfold==false,showbtn:isfold==true},stylecolor]" @click='unfold'>
            <i class="unread">{{ unread }}</i>
        </div>
        <!-- 展开 -->
        <div :class="['chatroot','transition',{hidepannel:isfold==true,showpannel:isfold==false}]">
            <!-- toast --> 
            <div :class="['toast_box','transition',{'show_toast':toast}]">
                <div class="toast">{{toast_message}}</div>
            </div>
            <!-- 登录 -->
            <div :class="['chat','front3',edgecolor,stylecolor,{'hidepannel':user_login,'showpannel':!user_login}]" code=32>
                <div :class="['slot']">
                    <img src="dist/copy/小熊.png">
                    <div class="login">
                        <input type="text" class="type_in" placeholder="用户id" v-model='login_uid'>
                        <input type="password" class="type_in" placeholder="密码" v-model='login_ucode'>
                    </div>
                    <div class="guide clearfix">
                        <a href="javascript:;" class="fl">忘记密码?</a>
                        <a href="javascript:;" class="fr" @click='go_register'>新用户注册>></a>
                    </div>
                    <div class="btn">
                        <a href="javascript:;" @click='is_login_verify' login>&nbsp;登录</a>
                    </div>
                </div>
                <div class="login_foot">
                    <div class="welcome">
                        亲爱的用户熊，很高兴你能来比比！
                    </div>
                    <div class="sign">
                        —— 聊天熊
                    </div>
                </div>
            </div>
            <!-- 注册 -->
            <div :class="['chat','transition','front4',edgecolor,stylecolor,{'hidepannel':!show_register,'showpannel':show_register}]" code=31>
                <div :class="['slot']">
                    <img src="src/assets/小熊.png">
                    <div :class="['glad_to']">欢迎你，新用户！</div>
                    <div class="signin">
                        <input type="text" class="type_in" placeholder="账户名" name="id" v-model='register_uid'>
                        <div class="remark" id>仅支持字母、数字、下划线</div>
                        <input type="password" class="type_in" placeholder="登录密码" name="pw" v-model='register_ucode'>
                        <div class="remark" pw>密码须为6-16位</div>
                        <input type="text" class="type_in" placeholder="昵称" name="repw" v-model='register_uname'>
                        <div class="remark" repw>仅支持中文、英文、emoji、“_”</div>
                    </div>
                    <div class="btn">
                        <a href="javascript:;" @click='new_register' reg>&nbsp;注册</a>
                    </div>
                    <div class="guide clearfix">
                        <a href="javascript:;" @click='leave_register' class="fr">已有账户去登录>></a>
                    </div>
                </div>
            </div>
            <!-- 主界面 -->
            <div :class="['chat','transition','front1',edgecolor]" code=33>
                <!-- 主界面头部 -->
                <div :class="['user','father',stylecolor,'transition']">
                    <div class="avatar-case bgwhite">
                        <img :src="useravatar">
                    </div>
                    <article class="user-title white_letter"> {{ username }} </article>
                    <a href="javascript:;" class="btn1-set white_letter" @click='fold'>迷你</a>
                    <a href="javascript:;" class="btn2-set white_letter" @click='changecolor'>换色</a>
                    <a href="/Public/login" :class="[{'show':userid == 0,'hide':userid != 0},'label']"></a>
                </div>
                <!-- 主界面消息列表标题 搜索框 -->
                <div :class="['search','search-height','father',stylecolor,'transition']">
                    <div class="fl"><span class="white_letter">{{ categorytitle }}</span></div>
                    <span class="input-search father">
                        <input type="text" name="filter"  id="filter" placeholder="输入关键字" v-model='q'>
                        <i class="chat_app_icon chat_app_icon_search" style="color: #9b9b9b;"></i>
                    </span>
                </div>
                <!-- 主界面消息列表 -->
                <div class="chatlist">
                    <div class="friend-group">
                        <ul>
                            <li v-for="(item,index) in curlist " class="father"  @click='talk(item)' >
                                <div :class="['libox','father','bcolor','transition']">
                                    <div class="avatar-case size60">
                                        <img :src="src(item.avatar)">
                                    </div>
                                    <div class="friend-name">{{ item.name }}</div>
                                    <div class="last-message">
                                        <span>{{ item.last }}</span>
                                    </div>
                                    <div class="info-message">
                                        <time :datetime="formdate(item.timestamp)">{{ gap(item.timestamp) }}</time>
                                        
                                    </div>
                                    <i class="dot son" :figure='item.unread'>{{ item.unread }}</i>                          
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 主界面消息分类 页面底部 -->
                <div :class="['toolsbar',stylecolor,'transition']">
                    <ul class="clearfix">
                        <li v-for="(item,index) in categories" :class="{'bgwhite':index == itemsfilter,'white_letter':index != itemsfilter}" @click='listload(index)'><span>{{ item.short }}</span></li>
                    </ul>
                </div>
            </div>
            <!-- 聊天室 -->
            <div :class="['chat','transition','front2',edgecolor,{'hidepannel':curspeaker ==-1,'showpannel':curspeaker  != -1}]" code=34>
                <!-- 聊天室名称 -->
                <div :class="['chatter','father',stylecolor]">
                    <div class="avatar-case size30 bgwhite">
                        <img :src="current_speaker_image">
                    </div>
                    <article class="chat-title white_letter">{{ current_speaker_name }}</article>
                    <a href="javascript:;" class="chat-close white_letter" @click='endspeak'>关闭</a>
                </div>  
                <!-- 聊天室消息流 -->
                <div :class="['chatbox',scrollcolor]">
                    <div  v-for='message in current_room_messages'>
                         <div class="center" v-if='message.is_from_sys == true'>
                            <span :class="['tips','left',{'un_lineheight':message.type == 2}]">
                                <span v-if='message.type == 1'>{{ message.text }}</span>
                                <a v-if='message.type == 2' href="javascript:;" class="img_click"><img :src="src(message.text)" class="img-fit"></a>
                            </span>
                             <div class="sys-message-time">{{ gap(message.timestamp) }}</div>
                        </div>
                        <div v-else>
                             <div class="box left" v-if='message.is_from_me == false'>
                                <span :class="['send',stylecolor,'lightgray',{'un_lineheight':message.type == 2}]">
                                    <span v-if='message.type == 1'>{{ message.text }}</span>
                                <a v-if='message.type == 2' href="javascript:;" class="img_click"><img :src="src(message.text)" class="img-fit"></a>
                                </span>
                                <time :datetime="formdate(message.timestamp)" class="send-time">{{ gap(message.timestamp) }}</time>
                            </div>
                            <div class="box right" v-if='message.is_from_me == true '>
                                <span :class="['get','left','darkgray','light',{'un_lineheight':message.type == 2}]">
                                    <span v-if='message.type == 1'>{{ message.text }}</span>
                                <a v-if='message.type == 2' href="javascript:;" class="img_click"><img :src="message.text" class="img-fit"></a>
                                </span>
                                <time :datetime="formdate(message.timestamp)" class="get-time">{{ gap(message.timestamp) }}</time>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 消息发送框 -->
                <div class="talk">
                    <div class="talk-box father">
                        <div class="talk-form father">
                            <pre>{{ sayings }}</pre>
                            <textarea name="talk" id="talk" placeholder="enter发送 shift+enter换行" v-model='sayings' @keydown='enter'></textarea>
                        </div>
                        <form id="pic_send">
                            <label class="file chat_app_icon chat_app_icon_pic" for="sendfile"></label>
                            <input type="file" name="sendfile" id="sendfile" v-show='false' ref='file' accept="image/png,image/gif,image/jpeg" @change='upload' multiple>
                        </form>
                        <!-- <span class="emoji"></span>         -->
                    </div>
                </div>
            </div>  
        </div>
    </div>
</template>
<script>
import handler from './static.js';

let app = {
        name: 'app',
        data(){
            return {
                stylearr: ['purple', 'red', 'gray', 'green', 'google_blue', 'twitter_blue'],
                stylecolor: 'red',
                isfold: true,
                user_login:false,
                login_uid:'',
                login_ucode:'',
                log_option:{},
                ajax_port:3000,
                register_uid:'',
                register_ucode:'',
                register_uname:'',
                reg_option:{},
                show_register:false,
                toast:false,
                toast_message:'',
                empty_tip: '还没有开始聊天',
                sayings: '',
                path: 'dist/copy/',
                target: '',
                main: 0,
                unread: '',
                username: 'pikachu',
                useravatarname: '1.jpeg',
                current_speaker_image: '',
                current_speaker_name: '',
                userid: 0,
                categorytitle: '最近联系的人',
                box: '',
                now: new Date().valueOf(),
                setIt: '',
                itemsfilter: 0,
                q: '',
                curspeaker: -1,
                historyspeaker: [],
                items: [],
                friends: [],
                current_room_messages: [],
                categories: [{
                    title: '最近联系的人',
                    short: '最近',
                    type: 1
                }, {
                    title: '我的好友',
                    short: '好友',
                    type: 2
                }, {
                    title: '官方小助手',
                    short: '官方',
                    type: 3
                }],
                types:{
                  "css": "text/css",
                  "gif": "image/gif",
                  "html": "text/html",
                  "ico": "image/x-icon",
                  "jpeg": "image/jpeg",
                  "jpg": "image/jpeg",
                  "js": "text/javascript",
                  "json": "application/json",
                  "pdf": "application/pdf",
                  "png": "image/png",
                  "svg": "image/svg+xml",
                  "swf": "application/x-shockwave-flash",
                  "tiff": "image/tiff",
                  "txt": "text/plain",
                  "wav": "audio/x-wav",
                  "wma": "audio/x-ms-wma",
                  "wmv": "video/x-ms-wmv",
                  "xml": "text/xml"
                },
                test2: '',
                tid:''
            }
        },
        created() {
            var Self = this;
            this.setIt = setInterval(function() {
                Self.now = Self.upDate()[0];
            }, 2000);
            var item = {};
            item.id = 26;
            item.categoryid = 1;
            item.name = '我是测试item';
            item.avatar = '3.jpeg';
            item.last = '我是测试message';
            item.timestamp = 1495059082071;
            item.unread = 3;
            this.items.push(item);
        },
        methods: {
            upDate() {
                var up = new Date();
                return [up.getTime(), up];
            },
            fold() {
                this.isfold = true;
            },
            unfold: function() {
                this.isfold = false;
            },
            is_login_verify:function(){
                var that = this;
                this.log_option = {
                    id:that.login_uid,
                    code:that.login_ucode
                };
                $.ajax({
                    url:window.location.protocol + "//" + window.location.hostname + ":" + that.ajax_port + "/login",
                    type:'post',
                    data:that.log_option,
                    dataType:'json',
                    success:function(res){
                        if (res.status == 1) {
                            for(var k in res)
                            {
                                if (k != 'status' && k != 'code' && k != '_id') {
                                    that["user" + k] = res[k];
                                }else if(k == '_id'){
                                    that.tid = res[k];
                                }
                            }
                            that.toast_pop('登录成功');                            
                            that.is_login();
                        }else if(res.status == 0){
                            that.toast_pop('密码或用户名错误');  
                        }else if(res.status == -1){
                            that.toast_pop('信息不全，请重新提交');  
                        }
                    },
                    error:function(xhr,status,obj){
                        that.toast_pop('网络错误');  
                    }
                })
            },
            toast_pop:function(msg){
                this.toast = true;
                this.toast_message = msg;
                var that = this;
                setTimeout(function(){
                    that.toast =false;
                    that.toast_message = '';                    
                },1500)
            },
            is_login:function(){
                this.user_login = true;
            },
            not_login:function(){
                this.user_login = false;
            },
            go_register:function(){
                this.show_register = true;
            },
            leave_register:function(){
                this.show_register = false;
            },
            new_register:function(){
                var that = this;
                this.reg_option = {
                    id:that.register_uid,
                    code:that.register_ucode,
                    name:that.register_uname
                }
                $.ajax({
                    url:window.location.protocol + "//" + window.location.hostname + ":" + that.ajax_port + "/register", 
                    type:'post',
                    dataType:'json',
                    data:that.reg_option,
                    success:function(res){
                        if (res.ok == 1) {
                            that.toast_pop(' 注册成功');                            
                            that.leave_register();
                        }else if(res.ok == 0){
                            that.toast_pop('网络差，请重试'); 
                        }else if(res.ok == -1){
                            that.toast_pop("该账号已注册");  
                        }else if(res.ok == -2){
                            that.toast_pop("信息不全，请重新提交");  
                        }else{
                            that.toast_pop("What is the fuck?");  
                        }
                    },
                    error:function(xhr,status,obj){
                        that.toast_pop('网络错误');  
                    }
                })
            },        
            sendMessage: function(text) {
                var item = {};
                item.type = handler.message.TYPE_TXT;
                item.speaker = 0;
                item.text = text;
                item.timestamp = new Date().getTime();
                item.is_from_me = true;
                this.current_room_messages.push(item);
                for(var i=0;i<this.items.length;i++){
                    if (this.items[i].id == this.curspeaker) {
                        this.items[i].last = text;
                        this.items[i].timestamp = new Date().getTime();
                    }
                }
                setTimeout(function() {
                    $('.chatbox>div:last-child')[0].scrollIntoView();
                }, 100);
            },
            sendImage: function(src) {
                var item = {};
                item.type = handler.message.TYPE_IMG;
                item.speaker = 0;
                item.text = src;
                item.timestamp = new Date().getTime();
                item.is_from_me = true;
                this.current_room_messages.push(item);
                for(var i=0;i<this.items.length;i++){
                    if (this.items[i].id == this.curspeaker) {
                        this.items[i].last = '[图片]';
                        this.items[i].timestamp = new Date().getTime();
                    }
                }
                setTimeout(function() {
                    $('.chatbox>div:last-child')[0].scrollIntoView();
                }, 100);
            },
            formdate: function(timestamp) {
                return new Date(timestamp).toISOString();
            },
            gap: function(timestamp) {
                var gap = this.now - timestamp;
                var gaptime;
                if (gap < 60 * 1000) {
                    gaptime = '刚刚'
                } else if (gap < 60 * 60 * 1000) {
                    gaptime = parseInt(gap / (60 * 1000)) + "分钟前"
                } else if (gap < 24 * 60 * 60 * 1000) {
                    gaptime = parseInt(gap / (60 * 60 * 1000)) + "小时前"
                } else if (gap < 365 * 24 * 60 * 60 * 1000) {
                    gaptime = parseInt(gap / (24 * 60 * 60 * 1000)) + "天前"
                } else {
                    gaptime = '很久以前'
                }
                return gaptime;
            },
            formdategroup: function(date) {
                var that = new Date(date);
                var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                return that.getFullYear() + '年' + (that.getMonth() < 9 ? '0' : '') + (that.getMonth() + 1) + '月' + (that.getDate() < 10 ? '0' : '') + that.getDate() + '日 ' + week[that.getDay()];
            },
            src: function(avatar) {
                return this.path + avatar;
            },
            listload: function(index) {
                this.itemsfilter = index;
                this.categorytitle = this.categories[index].title;
                if (this.categories[index] == 2) {
                    
                }
            },
            talk: function(room_item) {
                this.curspeaker = room_item.id;
                this.current_room_id = room_item.id;
                this.current_speaker_image = this.path + room_item.avatar;
                this.current_speaker_name = room_item.name;
                this.readRoomItem(room_item.id);
            },
            readRoomItem: function(room_id) {
                for (var i = this.items.length - 1; i >= 0; i--) {
                    if (this.items[i].id == room_id) {
                        this.items[i].unread = '';
                    }
                }
            },
            endspeak: function() {
                this.curspeaker = -1;
                this.current_room_id = 0;
            },
            enter: function(e) {
                if (!e.shiftKey && !e.ctrlKey && e.keyCode == 13) {
                    this.sendMessage(this.sayings);
                    this.sayings = '';
                    e.cancelBubble = true;
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            },
            upload: function(e) {
                var Self = this;
                var target = this.target = e.target;
                var files = target.files;
                function readAsDataUrl(file){
                    var reader = new FileReader();
                    reader.onload = function(){
                            var src = reader.result;
                            Self.sendImage(src);   
                        }
                    reader.readAsDataURL(file);
                }
                for (var i = 0; i < files.length; i++) {
                    readAsDataUrl(files[i]);
                }
                $('#pic_send')[0].reset();
            },
            changecolor: function() {
                var long = this.stylearr.length;
                var i = parseInt(Math.random() * long);
                this.stylecolor = this.stylearr[i];
            }
        },
        computed: {
            edgecolor: function() {
                return this.stylecolor + '_edge'
            },
            bcolor: function() {
                return this.stylecolor + '_b'
            },
            letter_color: function() {
                return this.stylecolor + '_letter'
            },
            scrollcolor: function() {
                return this.stylecolor + '_scr'
            },
            curlist: function() {
                var option = { 'q': this.q, 'filter': this.itemsfilter };
                var arr = this.items.filter(function(item) {
                    if (this.filter == 0) {
                        return true && item.name.indexOf(this.q) != -1;
                    } else {
                        return item.categoryid == this.filter && item.name.indexOf(this.q) != -1;
                    }
                }, option)
                return arr.sort(function(a, b) {
                    return b.timestamp - a.timestamp;
                })
            },
            useravatar: function() {
                return this.path + this.useravatarname;
            },
            lastspeaker: function() {
                var history = this.historyspeaker;
                if (this.curspeaker >= 0) {
                    history.push(this.curspeaker);
                }
                return history[history.length - 1];
            },
            test: function() {
                return this.itemsfilter * 10;
            }
        },
        watch: {
            isfold: function() {
                if (this.isfold == false) {
                    $('body').css('overflow', 'hidden');
                } else {
                    $('body').css('overflow', 'auto');
                }
            },
            q:function(){
                if (this.q != '') {
                    this.empty_tip = '搜索结果为空'
                }else{
                    this.empty_tip = '还没有开始聊天'
                }
            }
        }
    }
export default app;
</script>

<style scoped>
/* 分离全局老样式 */

* {
    margin: 0;
    padding: 0;
    text-decoration: none;
    list-style: none;
    outline-style: none;
    font-style: normal;
    font-weight: normal;
    font-family: normal;
}
i,
span,
* {
    font-family: normal;
    font-style: normal;
}

:after,
:before {
    box-sizing: content-box;
}


/* 字体图标 */

@font-face {
    font-family: "Chat App";
    src: url('assets/fonts/iconfont.eot?t=1499250865033');
    /* IE9*/
    src: url('assets/fonts/iconfont.eot?t=1499250865033#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('assets/fonts/iconfont.woff?t=1499250865033') format('woff'), /* chrome, firefox */
    url('assets/fonts/iconfont.ttf?t=1499250865033') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
    url('assets/fonts/iconfont.svg?t=1499250865033#iconfont') format('svg');
    /* iOS 4.1- */
}

.chat_app_icon {
    font-family: "Chat App" !important;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.chat_app_icon_search:before {
    content: "\e651";
}

.chat_app_icon_pic:before {
    content: "\e728";
}

.chat_app_icon_add:before {
    content: "\e638";
}

.chat_app_icon_friends:before {
    content: "\e60e";
}

/* 皮肤 */


/* 浅绿 */

 .green {
    background-color: #b9f5a2!important;
}

 .send.green:before {
    border-right: 8px solid #b9f5a2;
}

 .green_scr::-webkit-scrollbar-thumb {
    background-color: #b9f5a2;
    border-radius: 10px;
}

 .green_scr::-webkit-scrollbar-button {
    background-color: #b9f5a2;
}

 .green_b {
    border-bottom: 1px solid #b9f5a2;
}

 .green_edge {
    border-left: 1px solid #b9f5a2;
    border-right: 1px solid #b9f5a2;
}
.green_letter{
    color: #b9f5a2;
}


/* 浅紫 */

 .purple {
    background-color: #aa9ed8!important;
}

 .send.purple:before {
    border-right: 8px solid #aa9ed8;
}

 .purple_scr::-webkit-scrollbar-thumb {
    background-color: #aa9ed8;
    border-radius: 10px;
}

 .purple_scr::-webkit-scrollbar-button {
    background-color: #aa9ed8;
}

 .purple_b {
    border-bottom: 1px solid #aa9ed8;
}

 .purple_edge {
    border-left: 1px solid #aa9ed8;
    border-right: 1px solid #aa9ed8;
}
.purple_letter{
    color: #aa9ed8;
}

/* 深灰 */

 .gray {
    background-color: gray!important;
}

 .send.gray:before {
    border-right: 8px solid gray;
}

 .gray_scr::-webkit-scrollbar-thumb {
    background-color: gray;
    border-radius: 10px;
}

 .gray_scr::-webkit-scrollbar-button {
    background-color: gray;
}

 .gray_b {
    border-bottom: 1px solid gray;
}

 .gray_edge {
    border-left: 1px solid gray;
    border-right: 1px solid gray;
}
.gray_letter{
    color: gray;
}

/* 大红 */

 .red {
    background-color: #d60505!important;
}

 .send.red:before {
    border-right: 8px solid #d60505;
}

 .red_b {
    border-bottom: 1px solid #d60505;
}

 .red_scr::-webkit-scrollbar-thumb {
    background-color: #d60505;
    border-radius: 10px;
}

 .red_scr::-webkit-scrollbar-button {
    background-color: #d60505;
}

 .red_edge {
    border-left: 1px solid #d60505;
    border-right: 1px solid #d60505;
}
.red_letter{
    color: red;
}

/* 谷歌蓝 */

 .google_blue {
    background-color: #4385f5 !important;
}

 .send.google_blue:before {
    border-right: 8px solid #4385f5;
}

 .google_blue_b {
    border-bottom: 1px solid #4385f5;
}

 .google_blue_scr::-webkit-scrollbar-thumb {
    background-color: #4385f5;
    border-radius: 10px;
}

 .google_blue_scr::-webkit-scrollbar-button {
    background-color: #4385f5;
}

 .google_blue_edge {
    border-left: 1px solid #4385f5;
    border-right: 1px solid #4385f5;
}
 .google_blue_letter{
    color: #4385f5;
 }


/* Twitter蓝 */

 .twitter_blue {
    background-color: #55acef!important;
}

 .send.twitter_blue:before {
    border-right: 8px solid #55acef;
}

 .twitter_blue_b {
    border-bottom: 1px solid #55acef;
}

 .twitter_blue_scr::-webkit-scrollbar-thumb {
    background-color: #55acef;
    border-radius: 10px;
}

 .twitter_blue_scr::-webkit-scrollbar-button {
    background-color: #55acef;
}

 .twitter_blue_edge {
    border-left: 1px solid #55acef;
    border-right: 1px solid #55acef;
}
 .twitter_blue_letter{
    color: #55acef;
 }

/* 发送方对话框默认颜色 */

 .light {
    background-color: #f0f0f0
}

 .light.get:before {
    border-left: 8px solid #f0f0f0;
}


/* 正文 */

::selection {
    background: #373b43;
    color: #fff;
}

 .blue {
    background-color: #257efa;
}

 .bgwhite {
    background-color: #fff;
}

 .purple {
    background-color: #aa9ed8 !important;
}

 .lightgray {
    color: #f5f7fa;
}

 .darkgray {
    color: #726e6e;
}

 .white_letter {
    color: #fff;
}

 .border {
    border: 1px solid #666;
}

 .img-fit {
    width: 100%;
    height: 100%;
    border-radius: 20px;
/*    margin-top: -10px;
    transform: translate(0, -1px) scale(1.19, 1.16);*/
}

 .chat_date {
    padding: 2px 14px;
    font-size: 12px;
    color: #d7d7d7;
    border-radius: 10px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 180px;
    text-overflow: ellipsis;
    display: inline-block;
}

 .tips {
    padding: 8px 14px;
    font-size: 12px;
    color: #fff;
    background-color: #ccc;
    border-radius: 10px;
    overflow: hidden;
    max-width: 290px;
    display: inline-block;
    margin: 30px 0;
}

 .box {
    margin: 10px auto;
    padding: 10px;
    color: #999;
    font-size: 12px;
}

 .left {
    text-align: left;
}

 .right {
    text-align: right;
}

 .center {
    text-align: center;
}

 .father {
    position: relative;
}

 .son {
    position: absolute;
}

 .get:empty,
.send:empty {
    display: none;
}

 .get,
.send {
    font-size: 14px;
    padding: 10px 27px;
    border-radius: 24px;
    line-height: 24px;
    max-width: 260px;
    display: inline-block;
    word-break: normal;
    white-space: pre-wrap;
    word-wrap: break-word;
    position: relative;
}

 .get:before {
    content: "";
    position: absolute;
    z-index: -1;
    bottom: 2px;
    right: -4px;
    border-bottom-left-radius: 40px;
    width: 12px;
    height: 18px;
    display: inline-block;
}

 .send:before {
    content: "";
    position: absolute;
    z-index: -1;
    bottom: 2px;
    left: -4px;
    border-bottom-right-radius: 40px;
    width: 12px;
    height: 18px;
    display: inline-block;
}

 .get-time {
    display: block;
    text-align: right;
    padding: 4px 8px;
    padding-right: 16px;
}

 .send-time {
    display: block;
    text-align: left;
    padding: 4px 8px;
    padding-left: 16px;
}

 .img_click {
    /*vertical-align: super;*/
    display: inline-block;
    width: 100%;
}

 .chatroot {
    position: fixed;
    right: 0;
    top: 0;
    width: 400px;
    height: 100%;
    background-color: #fff;
    z-index: 10000;
}

 .chat {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
}

 .chat[code='31'] {
    right: -400px;
}
 .chat[code='32'] {
    right: -400px;
}

 .chatter {
    height: 50px;
}

 .chatbox {
    margin-top: 50px;
    margin-bottom: 80px;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 130px);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    padding-top: 15px;
}

 .chatbox::-webkit-scrollbar {
    background-color: #fff;
    width: 10px;
}


/*::-webkit-scrollbar-corner */

 .chatbox::-webkit-scrollbar-track-piece {
    background-color: #fff;
}

 .user {
    height: 72px;
}

 .chatlist {
    margin-top: 119px;
    margin-bottom: 68px;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 187px);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
}

 .bcolor {
    border-bottom: 1px solid #f5f5f5;
}

 .search {
    text-align: right;
    padding: 8px 15px;
}

 .search-height {
    height: 31px;
    line-height: 31px;
    box-sizing: content-box;
}

 .toolsbar {
    height: 60px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}

 .toolsbar ul {
    margin-top: -2px;
    /*margin-left: 15px;*/
}

 .toolsbar ul li {
    float: left;
    padding: 0 15px;
    list-style: none;
    line-height: 30px;
    width: 30px;
    height: 30px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    box-sizing: content-box;
}

 .toolsbar ul li span {
    font-size: 12px;
}

 .toolsbar ul li:hover {}

 .toolsbar ul li:active {
    background-color: #f5f7fa;
    color: initial;
}

 .control {
    width: 100px;
    margin: 100px auto;
}

 .fl {
    float: left;
}

 .fr {
    float: right;
}

 .clearfix:before,
.clearfix:after {
    content: "";
    display: block;
    visibility: hidden;
    overflow: hidden;
    clear: both;
    line-height: 0;
    height: 0;
}


/* 过渡效果 */

 .transition {
    transition: all .5s ease-in;
    -webkit-transition: all .5s ease-in;
    -moz-transition: all .5s ease-in;
    -o-transition: all .5s ease-in;
}

 .transition_slow {
    transition: all 1s ease-in;
    -webkit-transition: all 1s ease-in;
    -moz-transition: all 1s ease-in;
    -o-transition: all 1s ease-in;
}

 .chat-close {
    line-height: 45px;
    margin-right: 30px;
    font-style: normal;
    position: absolute;
    right: 0;
    bottom: 0;
    text-decoration: none;
}

 .chat-title {
    padding-left: 80px;
    line-height: 50px;
    font-size: 18px;
}

 .user-title {
    padding-left: 80px;
    line-height: 72px;
    font-size: 18px;
}

 .btn1-set {
    line-height: 72px;
    margin-right: 30px;
    font-style: normal;
    position: absolute;
    right: 0;
    bottom: 0;
    text-decoration: none;
}
 .btn2-set {
    line-height: 72px;
    margin-right: 70px;
    font-style: normal;
    position: absolute;
    right: 0;
    bottom: 0;
    text-decoration: none;
}
 .btn3-set {
    line-height: 72px;
    margin-right: 110px;
    font-style: normal;
    position: absolute;
    right: 0;
    bottom: 0;
    text-decoration: none;
}

 .avatar-case {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 10px;
    left: 16px;
    border-radius: 35px;
    overflow: hidden;
}

 .avatar-case img {
    width: 100%;
    height: 100%;
    object-position: center center;
    object-fit: cover;
}

 .magnify {
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
    height: 100%;
    padding: 0 20px;
    font-size: 12px;
    width: auto;
}

 .model-name {
    display: inline-block;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    height: 100%;
    padding: 0 20px;
    font-size: 12px;
    width: auto;
}

 .model-name span {
    margin-left: 10px;
    font-size: 14px;
}

 .magnify span {
    margin-right: 10px;
}

 .search input,
.magnify input:focus {
    outline-style: none;
    border: 0;
    background-color: #f5f7fa;
    height: auto;
    padding: 3px 16px;
    font-size: 12px;
    color: #666;
    box-shadow: none;
    width: calc(100% - 188px);
    position: relative;
    top: -1px;
    border-radius: 30px;
    box-sizing: content-box;
    line-height: normal;
}

 .search input::-webkit-input-placeholder {
    color: #ccc;
}

 .search input:focus::-webkit-input-placeholder {
    color: transparent;
}

 .input-search i {
    display: inline-block;
    font-style: normal;
    width: 14px;
    height: 14px;
    line-height: 14px;
    position: absolute;
    right: 15px;
    top: 4px;
}

 .front1 {
    z-index: 10;
}

 .front2 {
    z-index: 20;
}
 .front3 {
    z-index: 30;
}
 .front4 {
    z-index: 40;
}
 .friend-group ul:empty:before {
    content: attr(data-tip);
    display: block;
    text-align: center;
    margin-top: 50%;
    color: #eee;
}

 .friend-group ul li {
    cursor: pointer;
    padding: 0 10px;
}

 .friend-group ul li:active {
    background-color: #f5f7fa;
}

 .friend-group ul li .libox {
    height: 50px;
    padding: 15px;
    box-sizing: content-box !important;
}

 .friend-group ul li .friend-name {
    position: absolute;
    left: 90px;
    top: 9px;
    z-index: 50;
    font-size: 18px;
    color: #3c3a3a;
}

 .friend-group ul li .last-message {
    position: absolute;
    left: 90px;
    bottom: 6px;
}

 .friend-group ul li .last-message span {
    color: #978e8e;
    font-size: 14px;
    white-space: nowrap;
    width: 230px;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
}

 .friend-group ul li .info-message {
    position: absolute;
    top: 10px;
    right: 10px;
}

 .friend-group ul li .info-message time {
    vertical-align: top;
    font-size: 13px;
    color: #978e8e;
}

 .friend-group ul li i {
    right: 10px;
    bottom: 10px;
}

 .dot {
    background-color: #56a4f2;
    color: #fff;
    border-radius: 100px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    border-bottom-left-radius: 0;
}

 .dot:empty,
 #mini i.unread:empty {
    display: none;
}

 .size60 {
    width: 60px;
    height: 60px;
}

 .size30 {
    width: 30px;
    height: 30px;
}

 .talk {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    width: 100%;
}

 .talk-box {
    padding: 10px;
    border-top: 1px solid rgba(0, 0, 0, .08);
}

 .talk-form {
    width: 80%;
}

 .talk-form pre {
    padding: 10px 80px 10px 10px;
    line-height: 20px;
    min-height: 40px;
    max-height: 100px;
    font-size: 15px;
    color: #455a64;
    white-space: pre-wrap;
    word-break: normal;
    word-wrap: break-word;
    box-sizing: border-box;
    overflow: hidden;
    border: 0;
}

 .talk-form textarea {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    border: 0;
    padding: 10px 80px 10px 10px;
    line-height: 20px;
    min-height: 40px;
    max-height: 120px;
    font-size: 15px;
    color: #455a64;
    width: 100%;
    height: 100%;
    resize: none;
    font-family: monospace;
}

 .talk-form textarea::-webkit-input-placeholder {
    color: #d2d2d2;
    font-size: 14px;
}

 .talk-form textarea:focus::-webkit-input-placeholder {
    color: transparent;
}

 .talk-form textarea::selection {
    background-color: #b3d4fc;
}

 .talk-form textarea::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
}

 .talk-box span.emoji,
.talk-box .file {
    position: absolute;
    z-index: 10;
    top: 20px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #85a0a6;
}

 .talk-box .emoji {
    right: 15px;
}

 .talk-box .file {
    right: 15px;
}

 .hidepannel {
    right: -402px !important;
    left: auto !important;
}

 .showpannel {
    right: 0 !important;
    left: auto !important;
}

 .hidebtn {
    right: -80px !important;
    left: auto !important;
}

 .showbtn {
    right: 30 !important;
    left: auto !important;
}

 #mini {
    position: fixed;
    right: 30px;
    bottom: 30px;
    width: 50px;
    height: 50px;
    border-radius: 100px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 80% 80%;
    background-image: url('assets/weixin-fff-eye.png');
    cursor: pointer;
    z-index: 100;
}

#mini i.unread {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 101;
    min-width: 10px;
    max-width: 42px;
    height: 18px;
    font-size: 12px;
    border-radius: 30px;
    color: white;
    background-color: red;
    padding: 0 4px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
}
 .un_lineheight{
    line-height: 0px;
    padding: 2px;
    min-height: 16px;
    min-width: 12px;
}

.label {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100%;
    z-index: 11;
}
.toast_box{
    position: absolute;
    top:45%;
    left: 0; 
    width: 100%;
    z-index: 99999;
    opacity: 0;
}
.show_toast{
    opacity: 1;
}
.show_toast .toast{
    width: 200px;
    padding: 25px;
    margin: 0 auto;
    background-color: rgba(255,255,255,0.75);
    color: #000;
    text-align: center;
    font-size: 12px;
    line-height: 18px;
    border-radius: 25px;
}
.sys-message-time {
    color: #999;
    text-align: center;
    font-size:12px !important;
    margin-top: -30px;
}


/* 登录注册 */
[code='32'] .slot{
    margin:100px auto;
    width: 300px;
}
[code='32'] .slot img{
    width: 80%;
    height: auto;
    display: block;
    margin: 0 auto 25px auto;
}
[code='32'] .slot .login input{
    width: 100%;
    height: 28px;
    margin-bottom: 10px;
    line-height: 28px;
    font-size: 16px;
    color: #fff;
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid rgba(255,255,255,0.4);
}
[code='32'] .slot .login input::placeholder{
    color: rgba(255,255,255,0.4);
}
[code='32'] .slot .login input:focus{
    border-bottom: 1px solid rgba(255,255,255,1);
}
[code='32'] .slot .login input:focus::placeholder{
    color: transparent;
}
[code='32'] .slot .guide a{
    color: #fff;
    font-size: 12px;
}
[code='32'] .slot .btn{
    margin-top: 30px;
}

[code='32'] .slot .btn [login]{
    letter-spacing: 50px;
    text-align: center;
    color: #fff;
    display: inline-block;
    width: 100%;
    line-height:40px;
    font-size: 20px;
    border-radius: 5px;
    border: 1px solid #fff;
    background-color: transparent;
}
[code='32'] .login_foot{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    color: #fff;
    font-size: 14px;
    line-height: 24px;
}
[code='32'] .login_foot .welcome{
    text-align: center;
}
[code='32'] .login_foot .sign{
    text-align: right;
    margin-right: 60px;
    margin-bottom: 20px;
}
[code='31'] .slot{
    width: 300px;
    margin: 0 auto;
}
[code='31'] .slot img{
    width: 80%;
    height: auto;
    display: block;
    margin: 0 auto 25px auto;
}
[code='31'] .slot .glad_to{
    margin: 25px auto;
    width: 100%;
    font-size: 28px;
    color: #fff;
    text-align: center;
}
[code='31'] .slot .signin input{
    width: 100%;
    height: 28px;
    margin-bottom: 10px;
    line-height: 28px;
    font-size: 16px;
    color: #fff;
    background-color: transparent;
    border: 0;
    border-bottom: 1px dashed rgba(255,255,255,0.4);
}
[code='31'] .slot .signin input::placeholder{
    color: rgba(255,255,255,0.4);
}
[code='31'] .slot .signin input:focus{
    border-bottom: 1px dashed rgba(255,255,255,1);
}
[code='31'] .slot .signin input:focus::placeholder{
    color: transparent;
}
[code='31'] .slot .signin .remark{
    text-align: right;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 20px;
    color: #fff;
}
[code='31'] .slot .guide a{
    color: #fff;
    font-size: 12px;
    margin-top: 10px;
}
[code='31'] .slot .btn{
    margin-top: 30px;
    text-align: right;
}

[code='31'] .slot .btn [reg]{
    letter-spacing: 50px;
    text-align: center;
    color: #fff;
    display: inline-block;
    width: 100%;
    line-height:40px;
    font-size: 20px;
    border-radius: 5px;
    border: 1px solid #fff;
    background-color: transparent;
}

</style>