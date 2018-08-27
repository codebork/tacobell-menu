import React, { Component, Fragment } from 'react';

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

  renderTableRows() {
    const {menuItems, search, selectedItems} = this.state;
    let itemsToShow = menuItems.filter(item => !selectedItems.has(item.id));

    if(search) {
      itemsToShow = itemsToShow.filter(item => {
        return item.name.toLowerCase().includes(search.toLowerCase()) || selectedItems.has(item.id);
      });
    }

    const selectedItemRows = menuItems.filter(item => selectedItems.has(item.id));

    return [...selectedItemRows, ...itemsToShow].map(item => {
      const nV = item.nutritionalValues;
      const isChecked = selectedItems.has(item.id);
      return (
        <tr key={item.name} className="menu-item">
          <td>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={this.toggleItem}
              id={item.id}
            />
          </td>
          <td>{item.name}</td>
          <td>{nV.energyKj}</td>
          <td>{nV.energyCal}</td>
          <td>{nV.totalFat}</td>
          <td>{nV.saturates}</td>
          <td>{nV.salt}</td>
          <td>{nV.carbs}</td>
          <td>{nV.sugars}</td>
          <td>{nV.protein}</td>
        </tr>
      )
    });
  }

  render() {
    return (
      <Fragment>
        <label htmlFor="search">Search:</label>
        <input name="search" type="text" onChange={this.changeSearch} value={this.state.search} />
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Energy (kJ)</th>
              <th>Energy (kcal)</th>
              <th>Total Fat (g)</th>
              <th>Saturates (g)</th>
              <th>Salt Equivalent (g)</th>
              <th>Carbs (g)</th>
              <th>Sugars (g)</th>
              <th>Protein (g)</th>
            </tr>
          </thead>
          <tbody>
            {this.renderTableRows()}
          </tbody>
        </table>
      </Fragment>
    )
  }
}
