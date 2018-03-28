<template>
  <div class="chat-wrapper">
    <div class="login" v-show="!isLogin">
      <div class="inner">
        <input type="text" v-model="username" placeholder="请输入用户名">
        <button @click="login">login</button>
      </div>
    </div>
     <header>多人聊天室（{{count}}人）</header>
     <main ref="main">
       <ul v-if="users.length">
          <li class="item" v-for="user in users" :key="user.name" v-if="user.type" :class="{'self': user.type== 1}">
            <div class="avator">
               <span class="name" v-html="user.name"></span>
            </div>
            <div class="message">{{user.msg}}</div>
          </li>
         <li class="item tip" v-else>
             <span class="msg">{{ user.msg }}</span>
         </li>
       </ul>
     </main>
     <footer>
        <input type="text" v-model="message">
       <span class="send" @click="sendMessage">send</span>
     </footer>
  </div>
</template>

<script>
import io from 'socket.io-client/dist/socket.io.js'
export default {
  name: 'HelloWorld',
  data () {
    return {
      users: [],
      message: '',
      socket: null,
      username: '',
      isLogin: false,
      count: 0
    }
  },
  methods: {
    sendMessage () {
      const vm = this
      if (!vm.message) {
        return console.log('输入不能为空')
      }
      vm.socket.emit('sendMessage', {msg: vm.message, username: vm.username})
      vm.users.push({type: 1, msg: vm.message, name: '我'})
      vm.message = ''
    },
    login () {
      const vm = this
      if (!vm.username) {
        return console.log('用户名不能为空')
      }
      vm.socket.emit('login', {username: vm.username})
    }
  },
  mounted () {
    const vm = this
    vm.socket = io('ws://localhost:8081')
    vm.socket.on('receiveMessage', data => {
      vm.users.push(data)
    })
    vm.socket.on('loginSuccess', data => {
      vm.username = data.username
      vm.isLogin = true
      console.log('登录成功')
    })
    vm.socket.on('getOtherMsg', data => {
      vm.users.push(data)
    })
    vm.socket.on('count', data => {
      vm.count = data.count
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" rel="stylesheet/less">
.flex() {
   display: flex;
   display: -webkit-flex;
}
.flex-col() {
  flex: 1;
  -webkit-flex: 1;
}
.triangle-tp(@width, @color) {
  width: 0;
  height: 0;
  border-left: @width solid transparent;
  border-right: @width solid transparent;
  border-bottom: @width solid @color;
}
// .triangle-bt(@width, @color) {
//   width: 0;
//   height: 0;
//   border-left: @width solid transparent;
//   border-right: @width solid transparent;
//   border-top: @width solid @color;
// }
.chat-wrapper {
  height: 100%;
  .flex();
  flex-direction: column;
  .login {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    .inner {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      -webkit-transform: translate(-50%, -50%);
              transform: translate(-50%, -50%);
    }
    input, button {
      width: 80%;
      margin-left: 10%;
      -webkit-appearance: none;
              appearance: none;
      background-color: #000;
      color: #fff;
      padding: 0 0 20px 0;
      border: none;
      outline: none;
      border-bottom: 1px solid #fff;
    }
    button {
      margin-top: 30px;
      padding: 10px 0;
      border: 1px solid #fff;
      -webkit-border-radius: 20px;
      border-radius: 20px;
    }
  }
  header {
    padding: 10px 0;
    font-size: 18px;
    background-color: #000;
    text-align: center;
    color: #fff;
  }
  main {
    padding: 10px;
    .flex-col();
    background-color: #eee;
    .item {
      .avator {
        img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        img,.name {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .message {
        position: relative;
        margin-top: 10px;
        display: inline-block;
        padding: 5px 15px;
        line-height: 20px;
        border-radius: 20px;
        background-color: #fff;
        color: #000;
        &:before {
          content: '';
          position: absolute;
          bottom: 100%;
          right: 15px;
          .triangle-tp(8px, #fff)
        }
      }
      &.self {
        text-align: right;
        .message {
           background-color: green;
          color: #fff;
          &:before {
            .triangle-tp(8px, green);
          }
        }
      }
      &.tip {
        text-align: center;
        .msg {
          margin-top: 10px;
          display: inline-block;
          padding: 2px 10px;
          font-size: 14px;
          color: #fff;
          background-color: #ccc;
          border-radius: 10px;
        }
      }
    }
  }
  footer {
    .flex();
    flex-direction: row;
    align-items: center;
    background-color: #fff;
    border: 1px solid #eee;
    input {
      .flex-col();
      overflow-y: auto;
    }
    .send {
       padding: 10px 20px;
       background-color: green;
       color: #fff;
    }
  }
}
</style>
