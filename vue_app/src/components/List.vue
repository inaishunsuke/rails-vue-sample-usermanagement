<template>
  <div class="list">
    <div>
      <v-toolbar flat color="gray">
        <v-toolbar-title>ユーザ管理</v-toolbar-title>
        <v-divider
         class="mx-3"
         inset
         vertical
        ></v-divider>

        <!-- リスト更新ボタン -->
        <v-icon @click="refresh()">refresh</v-icon>

        <v-spacer></v-spacer>
        <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>

        <!-- ユーザ追加ボタン フォームは下部 -->
        <v-btn fab dark small color="dark" class="mb-2"
          @click="dialog=true"
        >
          <v-icon dark>add</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- データテーブル部分
        rows-per-page-text="" 1ページあたり件数テキストの非表示
        :rows-per-page-items="[]" 1ページあたり件数セレクトの非表示
       -->
      <v-data-table
      style="z-index:0 !important;"
         :headers="headers"
         :items="userList"
         :search="search"
         rows-per-page-text=""
         :rows-per-page-items="[]"
         class="elevation-1"
         v-show="!deleteDialog"
      >

        <!-- テーブルボディ -->
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.age }}</td>
          <td class="text-xs-center">{{ props.item.mail }}</td>
          <td class="justify-center layout px-0">
            <!-- 編集ボタン -->
            <v-icon class="mr-2" @click="editUser(props.item.id)">
              edit
            </v-icon>
            <!-- 削除ボタン -->
            <v-icon @click="openDeleteDialog(props.item.id)">
              delete
            </v-icon>
          </td>
        </template>

        <!-- 検索結果なし -->
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          "{{ search }}" の検索結果なし
        </v-alert>
        <!-- データなしの時の表示 -->
        <template slot="no-data">
          No Data
        </template>

        <!-- フッターの件数表示 -->
        <template slot="pageText" slot-scope="props">
          {{ props.itemsLength }} 件中 {{ props.pageStart }} 件目 〜 {{ props.pageStop }} 件目
        </template>
      </v-data-table>

      <!-- 入力ダイアログのレイアウト -->
      <v-layout row justify-center>
        <v-dialog v-model="dialog" lazy persistent max-width="600px">
          <v-form  v-model="valid" lazy-validation>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      v-model="selectedUser.name"
                      label="ユーザ名(*)"
                      :rules="nameRules"
                      :counter="10"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      v-model="selectedUser.age"
                      label="年齢"
                      :rules="ageRules"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="selectedUser.mail"
                      label="メールアドレス(*)"
                      :rules="mailRules"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="save" :disabled="!valid">保存</v-btn>
              <v-btn color="blue darken-1" flat @click="close">キャンセル</v-btn>
            </v-card-actions>
          </v-card>
          </v-form>
        </v-dialog>
      </v-layout>

      <!-- 削除確認ダイアログのレイアウト -->
      <v-layout row justify-center>
        <v-dialog
          v-model="deleteDialog"
          persistent
          max-width="290px"
        >
          <v-card-text>
          削除しますか？
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="deleteUser">削除</v-btn>
            <v-btn color="blue darken-1" flat @click="close">キャンセル</v-btn>
          </v-card-actions>
        </v-dialog>
      </v-layout>

    </div>
  </div>
</template>

<script>
export default {
  name: 'list',
  data () {
    return {
      // ユーザ一覧が入る配列
      userList: [],

      // テーブルヘッダ
      headers: [
         { text: 'ID', align: 'center', value: 'id' },
         { text: '名前', align: 'center', value: 'name' },
         { text: '年齢', align: 'center', value: 'age' },
         { text: 'メールアドレス', align: 'center', value: 'mail' },
         { text: '操作', align: 'center', value: 'action', sortable: false }
      ],

      // 選択中のレコードの値
      selectedUser: {
        id: -1,
        name: '',
        age: '',
        mail: ''
      },

      // レコードの初期値
      defaultValue: {
        id: -1,
        name: '',
        age: '',
        mail: ''
      },

      search: '', // フィルタリング検索キーワード
      dialog: false, // 新規＆更新入力フォーム
      deleteDialog: false, // 削除確認ダイアログ
      valid: false, // バリデーション結果

      nameRules: [
        v => !!v || 'ユーザ名は必須です',
        v => v.length <= 16 || 'ユーザ名は16文字までです'
      ],

      ageRules: [
        v => /^[0-9]*$/.test(v) || '年齢は数値で入力してください'
      ],

      mailRules: [
        v => !!v || 'メールアドレスは必須です',
        v => /.+@.+/.test(v) || '無効なメールアドレスです'
      ]
    }
  },
  methods: {
    // ユーザ一覧
    indexUsers () {
      this.userList = [];
      axios.get("http://localhost:3000/users")
      .then( response => {
        this.userList = response.data;
        console.log("Index : record num=" + this.userList.length);
      })
      .catch( error => {
        console.log("Error : " + response);
      });
    },

    // ユーザ作成
    createUser (userInfo) {
      axios.post("http://localhost:3000/users", userInfo)
      .then( response => {
        console.log("Created : id=" + response.data.id);
      })
      .catch( error => {
        console.log("Error : " + response);
      })
      .then( () => {
        this.indexUsers();
      });
    },

    // ユーザ編集(読み出し)
    editUser (id) {
      this.selectedUser.id = id
      axios.get("http://localhost:3000/users/" + id)
      .then( response => {
        this.selectedUser = response.data;
        console.log("Edit : id=" + this.selectedUser.id);
        this.dialog = true;
      })
      .catch( error => {
        console.log("Error : " + response);
      })
    },

    // ユーザ編集(書き込み)
    updateUser (userInfo) {
      axios.patch("http://localhost:3000/users/" + userInfo.id, userInfo)
      .then( response => {
        console.log("Updated : id=" + response.data.id);
      })
      .catch( error => {
        console.log("Error : " + response);
      })
      .then( () => {
        this.indexUsers();
      });
    },

    // 削除ダイアログ
    openDeleteDialog (id) {
      this.selectedUser.id = id;
      this.deleteDialog = true;
    },

    // ユーザ削除
    deleteUser () {
      axios.delete("http://localhost:3000/users/" + this.selectedUser.id)
      .then( response => {
        console.log("Deleted : id=" + this.selectedUser.id);
      })
      .catch( error => {
        console.log("Error : " + response);
      })
      .then( () => {
        this.indexUsers();
        this.close();
      });
    },

    // 一覧の最新化
    refresh (){
      console.log("Refresh");
      this.indexUsers();
    },

    // ダイアログの保存ボタン
    save () {
      if (this.selectedUser.id == -1) {
        // 作成
        this.createUser(this.selectedUser);
      } else {
        // 更新
        this.updateUser(this.selectedUser);
      }
      this.close()
    },

    // ダイアログのキャンセルボタン
    close () {
      this.dialog = false
      this.deleteDialog = false
      setTimeout(() => {
        this.selectedUser = Object.assign({}, this.defaultValue)
      }, 500)
    },
  },
  computed: {
    // ダイアログのタイトルを作成と更新で使い分ける
    formTitle () {
      return this.selectedUser.id === -1 ? '新規ユーザ情報' : 'ユーザ情報の編集'
    }
  },
  mounted() {
    this.indexUsers();
  }
}
</script>

<style scoped>
</style>
