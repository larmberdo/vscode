(function (window) {
	'use strict';
	let vm = new Vue({
		el: '#app',
		data: {
			todoList:[],
			// isSelected: false,
			currentHash: 'all',
			currentIndex: null

		},
		directives: {
			'focus': {
				inserted(el, binding) {
					el.focus()
				},
				update(el,binding) {
					if(binding.value) {
						el.focus()
					}
				}
			},
		},
		methods: {
			destroy(e,index) {
				this.todoList.splice(index,1)
			},
			addItem(event) {
				let val = event.target.value.trim();
				if(val) {
					let newItem = {
						id: this.todoList.length+1,
						name: val,
						status: false
					}
					this.todoList.push(newItem);
				}
				event.target.value = ''
				console.log(this.todoList.length);
			},
			clearCompleted() {
				this.todoList = this.todoList.filter(el => {
					return !el.status
				})
			},
			editing(event,index) {
				this.currentIndex = index
			},
			escEdit() {
				this.currentIndex = null
			},
			saveEdit(event,item,index) {
				let content = event.target.value.trim();
				if(content) {
					this.todoList[index].name = content;
					this.currentIndex = null
				} else {
					alert('更改不能为空值');
					this.escEdit()
				}
			}
		},
		computed: {
			unCompletedList() {
				return this.todoList.filter(el => {
					return !el.status
				})
			},
			showMany() {
				return this.unCompletedList.length > 1 | this.unCompletedList.length == 0
			},
			showAll: {
				get() {
					return this.unCompletedList.length == 0
				},
				set(newVal) {
					if(newVal) {
						return this.todoList.forEach(element => {
							element.status = true
						});
					} else {
						return this.todoList.forEach(el => {
							el.status = false
						})
					}
				}
			},

			currentList() {
				switch (this.currentHash) {
					case 'active':
						return this.todoList.filter(el => !el.status)
						break;
					case 'completed':
						return this.todoList.filter(el => el.status)
						break;

					default:
						return this.todoList
						break;
				}
			}

		},
		watch: {
			todoList: {
				handler(newVal,oldVal) {
					let newTodoList = JSON.stringify(newVal)
					window.localStorage.setItem('todo',newTodoList)
				},
				deep:true
			}
		},
		created() {
			let list = JSON.parse(window.localStorage.getItem('todo'));
			this.todoList = list || []
		},

	})
	window.onhashchange = function () {
		let hash = window.location.hash.slice(2) || 'all';
		vm.currentHash = hash
	}

	window.onhashchange();

})(window);
