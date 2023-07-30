<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
</script>
<style>
.messageFromMe {
    @apply bg-indigo-300 bg-opacity-25
}

.messageToMe {
    @apply bg-gray-200 bg-opacity-25
}
</style>

<template>
    <AppLayout title="Chat">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Chat
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="flex bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg "
                    style="min-height: 400px; max-height: 400px">
                    <!-- List Users -->
                    <div class="w-2/5 bg-gray-300 bg-opacity-25 border-r border-gray-100  overflow-auto">
                        <ul>
                            <li v-for="user in users" :key="user.id" @click="loadMessages(user.id)"
                                :class="(userActive && userActive == user.id) ? 'bg-orange-500 bg-opacity-50' : ''"
                                class="p-6 text-lg text-gray-400 leading-7 font-semibold border-b border-gray-200 hover:bg-orange-500 hover:bg-opacity-50 hover:cursor-pointer cursor-pointer">
                                <p class="flex items-center capitalize">
                                    {{ user.name }}
                                    <span v-if="user.notification" class="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                                </p>
                            </li>
                        </ul>
                    </div>

                    <!-- Box Message -->
                    <div class="w-3/5 flex flex-col justify-between">
                        <!-- message -->
                        <div ref="messageContainer" class="w-full p-6 flex flex-col overflow-auto">
                            <div v-for="message in messages" :key="message.id"
                                :class="(message.from == $attrs.auth.user.id) ? 'text-right' : ''"
                                class="w-full mb-3 message">
                                <p :class="(message.from == $attrs.auth.user.id) ? 'messageFromMe' : 'messageToMe'"
                                    class="inline-block p-2 rounded-md" style="max-width: 75%;">{{ message.content
                                    }}</p>
                                <span class="block mt-1 text-xs text-gray-400">{{ formatarData(message.created_at) }}</span>
                            </div>
                            <div class="extra-scroll-space" style="height: 20px;"></div>
                        </div>

                        <!-- form -->
                        <div v-if="userActive" class="w-full bg-gray-200 bg-opacity-25 p-6 border-t border-gray-200">
                            <form v-on:submit.prevent="sendMessage" action="">
                                <div class="flex rounded-md overflow-hidden border border-gray-400">
                                    <input v-model="messageText" class="flex-1 px-4 py-2 text-sm focus:outline-none"
                                        type="text">
                                    <button type="submit"
                                        class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2">Enviar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
<script>
import axios from 'axios';
import store from '../store'
import { reactive } from 'vue';
export default {
    data() {
        return {
            users: [],
            messages: [],
            userActive: null,
            messageText: ''
        }
    },
    mounted() {
        axios.get('api/users')
            .then(response => {
                this.users = response.data.users
                this.$store.dispatch('setUsersState', this.users);
            })

        Echo.private(`user.${this.user.id}`).listen('.SendMessage', (e) => {
            if (this.userActive && this.userActive === e.message.from) {
                this.messages.push(e.message)
                this.scrollToBottom()
            } else {
                const user = this.users.find(user => user.id === e.message.from);
                console.log(user)
                if (user) {
                    this.$store.dispatch('updateUserNotification', { userId: user.id, notification: true });
                }
            }
            console.log(e)
        })
    },
    computed: {
        user() {
            return store.state.user
        }
    },
    methods: {
        scrollToBottom() {
            /*   if (this.messages.length) {
                  document.querySelectorAll('.message:last-child')[0].scrollIntoView()
              } */
            this.$nextTick(() => {
                this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
            });
        },
        async loadMessages(userId) {
            axios.get(`api/users/${userId}`)
                .then(response => {
                    this.userActive = response.data.user.id
                })

            await axios.get(`api/messages/${userId}`)
                .then(response => {
                    this.messages = response.data.messages
                })
            const user = this.users.find(user => user.id === userId);
            if (user) {
                this.$store.dispatch('updateUserNotification', { userId: user.id, notification: false });
            }
            this.scrollToBottom();
        },
        formatarData(data) {
            let novaData = new Date(data);
            return novaData.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        },
        async sendMessage() {
            await axios.post('api/messages/store', {
                'content': this.messageText,
                'to': this.userActive
            })
                .then(response => {
                    this.messages.push({
                        'from': this.user.id,
                        'to': this.userActive,
                        'content': this.messageText,
                        'created_at': new Date().toISOString(),
                        'update_at': new Date().toISOString()
                    })
                    this.messageText = ''
                })
            this.scrollToBottom();
        }
    },
}
</script>

