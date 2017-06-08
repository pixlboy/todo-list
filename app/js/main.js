(function(){

	let itemAddBtn = document.querySelector("#itemAddBtn");
	let itemAddInput = document.querySelector("#itemAddInput");
	let listWrapper = document.querySelector("#listWrapper");
	let removeItem = document.querySelector("#removeItem");
	let resetListBtn = document.querySelector("#resetListBtn");
	let itemCount = document.querySelector("#itemCount");
	let sortByName = document.querySelector("#sortByName");
	let deleteAllItems = document.querySelector("#deleteAllItems");
	let markAllDone = document.querySelector("#markAllDone");

	let store = window.localStorage;
	let selections = [];

	const ITEM_NAME_LENGTH = 120;
	const MAX_IETMS = 10;

	//this will be an object which encapsulates everything
	let todoList = () => {};

	//Initial items in list
	todoList.items = [];

	//Item Class
	todoList.itemClass = function(name, isDone){
		this.name = name;
		this.isDone = isDone || false;
		this.creation = new Date().getTime();
		return {
			name : this.name,
			isDone : this.isDone
		};
	};

	todoList.sortList = () => {
		todoList.items.sort((a, b) => {
  			return a.name > b.name;
		});
		todoList.renderList();
	};

	// Add a new item to the list
	todoList.addItemHandler = () => {
		let itemName = itemAddInput.value;
		let itemShrunk = itemAddInput.value.replace(/\s/g,'');
		if(todoList.items.length < MAX_IETMS && itemShrunk.length > 0 && itemShrunk.length <= ITEM_NAME_LENGTH){
			let newItem = new todoList.itemClass(itemName);
			todoList.items.push(newItem);
			todoList.renderList();
			todoList.updateItemCount();
			todoList.saveItems();
		}
	};


	// Remove the selected item from the list
	todoList.removeItemHandler = (idx) => {
		todoList.items.splice(idx,1);
		todoList.renderList();
		todoList.updateItemCount();
		todoList.saveItems();
	};


	// Remove the selected item from the list
	todoList.removeAll = () => {
		let sortedSelection = selections.sort().reverse();
		for(let i=0; i<sortedSelection.length; i++){
			todoList.items.splice(sortedSelection[i],1);
		}
		selections = [];
		todoList.renderList();
		todoList.updateItemCount();
		todoList.saveItems();
	};

	// Mark the selected items from the list
	todoList.doneAll = () => {
		let sortedSelection = selections.sort().reverse();
		for(let i=0; i<sortedSelection.length; i++){
			todoList.items[sortedSelection[i]].isDone = true;
		}
		selections = [];
		todoList.renderList();
		todoList.updateItemCount();
		todoList.saveItems();
	};


	// Mark an item as done
	todoList.doneItemHandler = (idx) => {
		todoList.items[idx].isDone = !todoList.items[idx].isDone;
		todoList.renderList();
		todoList.updateItemCount();
		todoList.saveItems();
	};


	// Remove all items from the list
	todoList.resetList = (idx) => {
		todoList.items = [];
		todoList.renderList();
		todoList.updateItemCount();
		todoList.saveItems();
	};


	todoList.updateItemCount = (idx) => {
		itemCount.innerHTML = todoList.items.length;
	};

	// Check for all items that are in done state
	todoList.updateItemsDone = (idx) => {
		for(let i = 0; i < todoList.items.length; i++){
			if(todoList.items[i].isDone){
				let done = document.getElementsByClassName('item-name');
				done[i].className = "item-name done";
			}
		}
	};


	// render the list on UI
	todoList.renderList = () => {
		let items = [];
		for(let i = 0; i < todoList.items.length; i++){
			items.push('<li id=item-'+i+' class="list-item"><input type="checkbox" class="pull-left select-item" /><span class="item-name">' + todoList.items[i].name + '</span><a class="pull-right remove-link" href="javascript:void(0)">Delete</a></li>');
		}
		listWrapper.innerHTML = items.join("");
		todoList.updateItemsDone();
	};


	// save the list in local storage/REST API can be used
	todoList.saveItems = () => {
		store.setItem('todoItems', JSON.stringify(todoList.items));
	};


	// retrive the saved list from local storage/REST API can be used
	todoList.setStore = () => {
		store.getItem('todoItems');
		if(store.todoItems){
			todoList.items = JSON.parse(store.todoItems);
		} else{
			todoList.items = [];
		}
	};


	// retrive the saved list from local storage/REST API can be used
	todoList.setSelections = (idx) => {
		if(selections.includes(idx)){
		 	selections.splice(idx, 1);
		} else{
		 	selections.push(idx);
		}
	};


	// initialise the list
	todoList.init = () => {
		todoList.setStore();
		todoList.renderList();
		todoList.updateItemCount();
	};


	todoList.init();

	////////////////// Event Handlers /////////////////////

	itemAddBtn.addEventListener("click", todoList.addItemHandler, false);
	resetListBtn.addEventListener("click", todoList.resetList, false);
	sortByName.addEventListener("click", todoList.sortList, false);

	deleteAllItems.addEventListener("click", (event) => {
		todoList.removeAll();
	}, false);

	markAllDone.addEventListener("click", (event) => {
		todoList.doneAll();
	}, false);

	itemAddInput.addEventListener("keyup", (event) => {
		if(event.keyCode === 13){
			todoList.addItemHandler();
		}
	}, false);

	// Using event delegation for dynamically generated items
	listWrapper.addEventListener("click", (event) => {
		if(event.target.className.indexOf('select-item') > -1){
			let idx = event.target.parentElement.id.slice(-1);
			todoList.setSelections(idx);
		}

		if(event.target.className.indexOf('item-name') > -1){
			let idx = event.target.parentElement.id.slice(-1);
		  	todoList.doneItemHandler(idx);
		}

		if(event.target.className.indexOf('remove-link') > -1){
			let idx = event.target.parentElement.id.slice(-1);
		  	todoList.removeItemHandler(idx);
		}
	}, false);


})();
