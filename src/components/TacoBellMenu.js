import React, { Component, Fragment } from 'react';
import '../styles/TacoBellMenu.scss';
import NutritionTable from './NutritionTable';

export default class TacoBellMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuItems: [],
      search: '',
      selectedItems: new Set()
    }

    this.changeSearch = this.changeSearch.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
  }

  componentDidMount() {
    fetch('menu.json')
      .then(res => res.json())
      .then(menuItems => this.setState({menuItems}))
      .catch(err => console.log(err));
  }

  changeSearch(e) {
    this.setState({
      search: e.target.value
    });
  }

  toggleItem(e) {
    const {selectedItems} = this.state;

    if(selectedItems.has(e.target.id)) {
      selectedItems.delete(e.target.id);
    } else {
      selectedItems.add(e.target.id);
    }

    this.setState({selectedItems});
  }

  getSelectedItems() {
    const {menuItems, selectedItems} = this.state;
    const selectedItemRows = menuItems.filter(item => selectedItems.has(item.id));

    return selectedItemRows;
  }

  getItems() {
    const {menuItems, search, selectedItems} = this.state;
    let itemsToShow = menuItems.filter(item => !selectedItems.has(item.id));

    if(search) {
      itemsToShow = itemsToShow.filter(item => {
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
    }

    return itemsToShow;
  }

  render() {
    const {search, selectedItems} = this.state;

    return (
      <div className='taco-bell-menu'>
        <input
          className="search-input"
          type="text"
          onChange={this.changeSearch}
          value={search}
          placeholder='Search'
        />
        <NutritionTable
          data={this.getSelectedItems()}
          selected={selectedItems}
          toggleItem={this.toggleItem}
          showTotal={true}
        />
        <NutritionTable
          data={this.getItems()}
          selected={selectedItems}
          toggleItem={this.toggleItem}
        />
      </div>
    )
  }
}
