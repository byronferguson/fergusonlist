<template>
  <div id="app">

    <!--<button @click="resetItem">New Item</button><br/> -->
    
    <h1>{{ updating ? 'Update Item' : 'New Item' }}</h1>
    <form>
      <label for="newItemName">
        Item Name
        <input v-model.trim="newItem.name" id="newItemName" />
      </label>
      <br/>
      <label for="newItemPrice">
        Item Price
        <input v-model.number="newItem.price" id="newItemPrice" />
      </label>
      <br />
      <button @click.prevent.stop="addItem" v-if="!updating">Add Item</button>
      <button @click.prevent.stop="saveItem" v-else>Save Item</button>
      
    </form>

    <h1>Items</h1>
    <ul>
      <li v-for="item in filteredItems">
          {{ item.name }} - {{ item.price }}
          <button @click="addToList(item)">Add to List</button>
          <button @click="updateItem(item)">Update</button>
          <button @click="removeItem(item)">Delete</button>
      </li>
    </ul>
    <input v-model="search" placeholder="Search" />

    <h1>List</h1>
    <ul>
      <li v-for="item in sortedList">
        <input type="checkbox"/>
        {{ item.name }} - {{ item.price }}
        <button @click="deleteFromList(item)">Remove</button>
      </li>
    </ul>

    <button @click="clearList">Clear List</button>

    <h3>Sub-Total: {{ listSubTotal | currency }}</h3>
    <h4>Tax: {{ listTax | currency }}</h4>
    <h1>Total: {{ listTotal | currency }}</h1>

    <label for="taxRate">
      Tax Rate
      <input v-model="taxRate" placeholder="Tax Rate" id="taxRate" />
    </label>

  </div>
</template>

<script>
import { db } from './firebase'

export default {
  name: 'app',
  data: () => ({
    items: [],
    list: [],
    updating: false,
    search: '',
    taxRate: 9.5,
    newItem: {}
  }),
  firebase: {
    items: {
      source: db.ref('items'),
      cancelCallback(err) {
        console.error(err)
      }
    },
    list: {
      source: db.ref('list'),
      // asObject: true,
      cancelCallback(err) {
        console.error(err)
      }
    }
  },
  computed: {
    filteredItems() {
      let list = []

      if(this.search.length) {
        list = this.items.filter((item) => {
          return item.name.toLowerCase().includes(this.search.toLowerCase())
        }, this)
      }
      else {
        list = this.items
      }

      return list.sort((a, b) => {
        return a.name > b.name
      })
    },
    listSubTotal() {
      let total = 0.0

      for(let i = 0; i < this.list.length; i++) {
        total += parseFloat(this.list[i].price)
      }
      return total
    },
    listTax() {
      return this.listSubTotal * (this.taxRate / 100)
    },
    listTotal() {
      return this.listSubTotal + this.listTax
    },
    sortedList() {
      return this.list.sort((a,b) => {
        return a.name > b.name
      })
    }
  },
  methods: {
    createItem(name, price) {
      return {
        name: name,
        price: price
      }
    },
    addItem() {
      this.$firebaseRefs.items.push(this.newItem)
      this.resetItem()
    },
    updateItem(item) {
      this.newItem = this.createItem(item.name, item.price)
      this.updateKey = item['.key']
      this.updating = true
    },
    saveItem() {
      this.$firebaseRefs.items.child(this.updateKey).set(this.newItem)
      this.updateKey = null
      this.updating = false
      this.resetItem()
    },
    removeItem(item) {
      this.$firebaseRefs.items.child(item['.key']).remove()
    },
    clearList() {
      this.$firebaseRefs.list.remove()
    },
    resetItem() {
      this.newItem = this.createItem('', 0.0)
    },
    addToList(item) {
      let newItem = {
        name: item.name,
        price: item.price
      }
      this.$firebaseRefs.list.push(newItem)
    },
    deleteFromList(item) {
      this.$firebaseRefs.list.child(item['.key']).remove()
    }
  },
  created() {
    this.resetItem()
  }
}
</script>