import axios from 'axios';
import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
})

const store = createStore({
    state: {
        user: {},
        users: []
    },
    mutations: {
        setUserState: (state, value) => state.user = value,

        setUsersState: (state, users) => state.users = users,

        UPDATE_USER_NOTIFICATION(state, payload) {
            const user = state.users.find(user => user.id === payload.userId);    
            if(user){
                user.notification = payload.notification;
            }
        },
    },
    actions: {
        userStateAction: ({ commit }) => {
            axios.get('api/user/me')
                .then(response => {
                    const userResponse = response.data.user
                    commit('setUserState', userResponse);
                })
        },
        setUsersState: ({ commit }, users) => {
            commit('setUsersState', users);  // Adicionado essa linha
        },
        updateUserNotification({ commit }, payload) {
            commit('UPDATE_USER_NOTIFICATION', payload);
        },
    },
    plugins: [vuexLocal.plugin]
});

export default store;