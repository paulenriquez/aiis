class CreatePurchaseOrders < ActiveRecord::Migration[5.0]
  def change
    create_table :purchase_orders do |t|
      t.date :purchase_date

      t.decimal :subtotal
      t.decimal :discount
      t.decimal :negotiated_price

      t.string :status

      t.string :payment_terms
      t.date :due_date

      t.text :remarks

      t.timestamps
    end
  end
end