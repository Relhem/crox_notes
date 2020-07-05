Vue.component('notes', {
    data: function () {
      return {
        notes:[],
        loading: true,
        search:"",
        current_tags:[]
      }
    },

    template: `

    <div v-if="loading">
        <div class="cssload-container">
            <div class="cssload-whirlpool"></div>
        </div>
    </div>

    <div v-cloak v-else>

    <div v-cloak v-if="count() != 0">
      <div>
          <div class="form-group">
              <input type="text" class="form-control" id="note_name" placeholder="Имя тэга" v-model="search">
          </div>
      </div>
    </div>

        <div v-cloak v-if="count() != 0">

                    <div v-cloak class="row row-cols-1 row-cols-md-3">
                        <div v-if="searchContains(ind)" class="col mb-4"  v-for="(note, ind) in notes" :key="note.id">

                        
                     
                            <div>

                                <div class="card h-100">   
                                    <div class="card-header">
                                            Заметка #{{note.id}} (Автор: {{note.creator}})
                                     </div>

                                    <div class="card-body">
                                        <h5 class="card-title">{{note.name}}</h5>
                                        <h6 class="card-title">{{note.text}}</h6>
                                        <small>Отредактировано: {{note.updated_at.substring(0,20).replace("T", " ")}}</small>

                                        <br>                                                                

                                        <div  v-if="note.tags != ''">
                                        <br>
                                                <span v-for="tag in getTags(ind)" style="margin: 4px; padding: 2px; line-height: 30px; color: white; background: orange;">#{{tag}}</span>

                                        </div>

                                    </div>
                                 
                                    <div class="card-footer">
                                        <button type="submit" class="btn btn-danger" v-on:click="deleteNote(note.id)">Удалить</button>  
                                        <button type="submit" class="btn btn-primary" v-on:click="editNote(note.name, note.text, note.id)">Редактировать</button>      
                                        </div>

                                </div>    

                            </div>


                        </div>         
                    </div>

        </div>
        

        <div v-cloak v-else>
            <div class="alert alert-info mt-3 p-3">Нет ни одной заметки. </div>
        </div>

    </div>
`,

methods:{
    getAllNotes: function () {
        axios.get("http://localhost:8000/notes").then(response => {
            this.notes = response.data.notes;
            this.loading = false;
          })
      },

      searchContains: function (i) {

        var tags = ""+this.notes[i].tags;

        if (this.search == "") return true;

        if (tags.includes(""+this.search))
            return true;
        else
            return false;
      },

      getTags: function (i) {
        var tags = ""+this.notes[i].tags;
        return tags.split(" ");
      },


      deleteNote: function (id) {
        this.$parent.showDeleteModal(id);
      },

      editNote: function (name, text, id) {
            this.$parent.showEditModal(name, text, id);    
      },


      count: function () {
                var count = 0;
            for(var i = 0; i < this.notes.length; ++i){
                 count++;
            }
            return count;
      }
},

  mounted() {
        this.getAllNotes();
        
        this.$root.$on('update-list', () => {
            this.getAllNotes();
        })
      }
  })


  Vue.component('add-modal', {
    data: function () {
      return {
        note_name: '',
        note_text: '',
      }
    },

    template: `<div v-if="this.$parent.$data.addModalVisible" v-cloak style="position: fixed; margin: auto; right: 0; left: 0; z-index: 9999; background: rgba(0,0,0,0.6)" >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLongTitle">Добавление записи</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="hide()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          
            <div>
                <div class="form-group">
                <label for="note_name_input">Название заметки</label>
                <input class="form-control" id="note_name_input" v-model="note_name">
            </div>
        
            <div class="form-group">
                <label for="descr_input">Описание</label>
                <textarea class="form-control" id="descr_input" rows="3" v-model="note_text"></textarea>
                </div>
            </div>   

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" v-on:click="hide()">Закрыть</button>
          <button type="button" data-dismiss="modal" v-on:click="addNote()" class="btn btn-success">Добавить</button>
        </div>
      </div>
    </div>
  </div>`,

methods:{
    addNote: function () {

        axios.get("http://localhost:8000/addNote", {
            params: {
                creator: "User",
                text: this.note_text,
                name: this.note_name
              }
        }).then(response => {
            this.$parent.showSuccessMessage("Новая заметка успешно добавлена.");
            this.$root.$emit('update-list');
            this.note_name = '';
            this.note_text = '';
            this.hide();
          })

      },
      hide: function () {
        this.$parent.hideAddModal()
      }    
},



  mounted() {

      }
  })




  Vue.component('edit-modal', {
      
    data: function () {
      return {
        note_name: '',
        note_text: '',
        note_id: '',
        note_tag:'',
      }
    },

    template: ` <div v-if="this.$parent.$data.editModalVisible" v-cloak style="position: fixed; margin: auto; right: 0; left: 0; z-index: 9999; background: rgba(0,0,0,0.6)" >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLongTitle">Редактирование заметки #{{note_id}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="hide()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          
            <div class="form-group">
                <label for="note_name_input">Название заметки</label>
                <input type="" class="form-control" id="note_name_input" v-model="note_name">
              </div>

            <div class="form-group">
                <label for="descr_input">Описание</label>
                <textarea class="form-control" id="descr_input" rows="3" v-model="note_text"></textarea>
              </div>


              <div class="form-group">
              <label for="note_name_input">Тэг</label>
              <input type="" class="form-control" id="note_tag_input" v-model="note_tag">
            </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" v-on:click="hide()">Закрыть</button>
          <button type="submit" class="btn btn-success" v-on:click="switchTag()">Добавить/удалить тэг</button>  
          <button type="button" data-dismiss="modal" class="btn btn-primary" v-on:click="update()">Сохранить</button>

        </div>
      </div>
    </div>
  </div>`,

methods:{

      setData: function () {
        this.note_name = this.$parent.$data.target_name;
        this.note_text = this.$parent.$data.target_text;
        this.note_id = this.$parent.$data.target_id;
      } ,

      hide: function () {
        this.$parent.hideEditModal()
      } ,
      
      update: function () {

        axios.get("http://localhost:8000/editNote/"+this.note_id, {
            params: {
                text: this.note_text,
                name: this.note_name
              }
        }).then(response => {
            this.$parent.showSuccessMessage("Изменения сохранены.");
            this.$root.$emit('update-list');
            this.note_name = '';
            this.note_text = '';
            this.hide();
          })
      },  

      switchTag: function () {


        axios.get("http://localhost:8000/switchTag/"+this.note_id, {
            params: {
                tag:this.note_tag
              }
        }).then(response => {
            this.$parent.showSuccessMessage("Тэг успешно изменён.");
            this.$root.$emit('update-list');
            this.note_name = '';
            this.note_text = '';
            this.hide();
          })
      }  


},

  mounted() {

    this.$root.$on('set-data', () => {
        this.setData();
    })
        
      }
  })



  
  Vue.component('delete-modal', {
    data: function () {
      return {
        note_name: '',
        note_text: '',
        note_id: '',
      }
    },

    template: `<div v-if="this.$parent.$data.deleteModalVisible" v-cloak style="position: fixed; margin: auto; right: 0; left: 0; z-index: 9999; background: rgba(0,0,0,0.6)" >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLongTitle">Удаление заметки</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="hide()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          
            Вы действительно хотите удалить заметку #{{note_id}}?

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" v-on:click="hide()">Отмена</button>
          <button type="button" data-dismiss="modal" class="btn btn-danger" v-on:click="deleteNote()">Удалить</button>
        </div>
      </div>
    </div>
  </div>`,

methods:{

      setData: function () {
        this.note_name = this.$parent.$data.target_name;
        this.note_text = this.$parent.$data.target_text;
        this.note_id = this.$parent.$data.target_id;
      } ,

      hide: function () {
        this.$parent.hideDeleteModal()
      } ,

      show: function () {
        this.$parent.showDeleteModal()
      } ,
      
      deleteNote: function () {
        axios.get("http://localhost:8000/deleteNote/"+this.note_id).then(response => {
            this.hide();
            this.$parent.showSuccessMessage("Запись успешно удалена.");
            
            this.$root.$emit('update-list');


          })
        
      }  

},

  mounted() {

    this.$root.$on('set-delete-data', () => {
        this.setData();
    })     
      }
  })




var app = new Vue({


    el: '#app',

    methods:{

        showSuccessMessage: function (msg) {
           this.successMsg = true;
           this.errorMsg = false;
           this.message = msg;
      },

        showAddModal: function () {
                this.addModalVisible = true;
          },

        hideAddModal: function () {
            this.addModalVisible = false;
      },

      showEditModal: function (name, text, id) {
        this.editModalVisible = true;
        this.target_name = name;
        this.target_text = text;
        this.target_id = id;
        this.$root.$emit('set-data');
  },

    hideEditModal: function () {
        this.editModalVisible = false;
    },
      
    showDeleteModal: function (id) {
        this.target_id = id;
        this.deleteModalVisible = true;
        this.$root.$emit('set-delete-data');
  },

    hideDeleteModal: function () {
        this.deleteModalVisible = false;
    },

    },


    data:{

        target_name:"",
        target_text:"",
        target_id:"",


        message:"",
        errorMsg: false,
        successMsg: false,
        addModalVisible: false,
        editModalVisible: false,
        deleteModalVisible: false,
        notes:[],
    }
});

