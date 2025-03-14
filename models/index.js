import sequelize from '../config/db.js';
import Customer from './Customer.js';
import Invoice from './Invoice.js';
import Product from './Product.js';
import Sale from './Sale.js';
import Supplier from './Supplier.js';
import User from './User.js';


// relationship
Supplier.hasMany(Product, { foreignKey: 'supplier_id' });
Product.belongsTo(Supplier, { foreignKey: 'supplier_id' });

Customer.hasMany(Invoice, { foreignKey: 'customer_id' });
Invoice.belongsTo(Customer, { foreignKey: 'customer_id' });

Invoice.hasMany(Sale, { foreignKey: 'invoice_id' });
Sale.belongsTo(Invoice, { foreignKey: 'invoice_id' });

Product.hasMany(Sale, { foreignKey: 'product_id' });
Sale.belongsTo(Product, { foreignKey: 'product_id' });


// sync db
export const syncDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection established successfully!');

        await sequelize.sync({ force: false }); // sync tables
        console.log('Database & tables created!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

export { sequelize, User, Product, Supplier, Customer, Invoice, Sale };