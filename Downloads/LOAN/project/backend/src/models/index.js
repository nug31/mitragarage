import User from './User.js';
import Item from './Item.js';
import Loan from './Loan.js';

// Define associations
User.hasMany(Loan, { foreignKey: 'userId', as: 'loans' });
Loan.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Item.hasMany(Loan, { foreignKey: 'itemId', as: 'loans' });
Loan.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

User.hasMany(Loan, { foreignKey: 'approvedBy', as: 'approvedLoans' });
Loan.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

export { User, Item, Loan }; 