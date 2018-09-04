import React, { Component } from 'react';

export default class MenuItem extends Component {
  render() {
    const { isChecked, toggleItem, item } = this.props;
    const nV = item.nutritionalValues;

    return (
      <tr className={this.props.className}>
        <td className={`${this.props.className}-checkbox`}>
          {toggleItem &&
            <input
              type="checkbox"
              checked={isChecked}
              onChange={toggleItem}
              id={item.id}
            />
          }
        </td>
        <td className={`${this.props.className}-name`}>{item.name}</td>
        <td className={`${this.props.className}-kj`}>{nV.energyKj}</td>
        <td className={`${this.props.className}-cal`}>{nV.energyCal}</td>
        <td className={`${this.props.className}-fat`}>{nV.totalFat}</td>
        <td className={`${this.props.className}-saturates`}>{nV.saturates}</td>
        <td className={`${this.props.className}-salt`}>{nV.salt}</td>
        <td className={`${this.props.className}-carbs`}>{nV.carbs}</td>
        <td className={`${this.props.className}-sugars`}>{nV.sugars}</td>
        <td className={`${this.props.className}-protein`}>{nV.protein}</td>
      </tr>
    )
  }
}

