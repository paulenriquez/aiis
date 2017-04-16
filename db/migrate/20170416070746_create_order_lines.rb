class CreateOrderLines < ActiveRecord::Migration[5.0]
  def change
    create_table :order_lines do |t|
      t.integer :quantity
      t.decimal :order_price

      t.timestamps
    end
  end
end
