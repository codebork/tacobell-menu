import React, { Component } from 'react';
import MenuItem from './MenuItem';

export default class NutritionTable extends Component {
  constructor(props) {
    super(props);

    this.toggleItem = this.toggleItem.bind(this);
  }

  renderHead() {
    const headingClass = 'nutrition-table__heading';
    return(
      <thead>
        <tr className={`${headingClass}`}>
          <th className={`${headingClass}-checkbox`}></th>
          <th className={`${headingClass}-name`}>Name</th>
          <th className={`${headingClass}-kj`}>Energy (kJ)</th>
          <th className={`${headingClass}-cal`}>Energy (kcal)</th>
          <th className={`${headingClass}-fat`}>Total Fat (g)</th>
          <th className={`${headingClass}-saturates`}>Saturates (g)</th>
          <th className={`${headingClass}-salt`}>Salt Equivalent (g)</th>
          <th className={`${headingClass}-carbs`}>Carbs (g)</th>
          <th className={`${headingClass}-sugars`}>Sugars (g)</th>
          <th className={`${headingClass}-protein`}>Protein (g)</th>
        </tr>
      </thead>
    );
  }

  getTotal() {
    const totalValues = this.props.data.reduce((acc, item) => {
      const totalNv = acc.nutritionalValues;
      const itemNv = item.nutritionalValues;

      for (const key of Object.keys(acc.nutritionalValues)) {
        const currTotal = totalNv[key];
        const newTotal = currTotal + parseFloat(itemNv[key]);

        totalNv[key] = Math.round(newTotal * 10) / 10;
      }

      acc.nutritionalValues = totalNv;
      return acc;
    }, {
      name: 'Total',
      nutritionalValues: {
        energyKj: 0,
        energyCal: 0,
        totalFat: 0,
        saturates: 0,
        salt: 0,
        carbs: 0,
        sugars: 0,
        protein: 0
      }
    });

    return totalValues;
  }

  toggleItem(e) {
    this.props.toggleItem(e);
  }

  renderBody() {
    const { data, showTotal, selected } = this.props;
    const menuItems = data.map(item => {
      return(
        <MenuItem
          key={item.id}
          item={item}
          toggleItem={this.toggleItem}
          isChecked={selected.has(item.id)}
          className='nutrition-table__item'
        />
      );
    });

    if(showTotal) {
      menuItems.push(
        <MenuItem
          key='total'
          item={this.getTotal()}
          className='nutrition-table__total'
        />
      );
    }

    return (
      <tbody>
        {menuItems}
      </tbody>
    );
  }

  render() {
    const { data, className } = this.props;

    if(data === undefined || !data.length) {
      return null;
    }

    return(
      <table className="nutrition-table">
        {this.renderHead()}
        {this.renderBody()}
      </table>
    );
  }
}
