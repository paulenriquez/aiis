class AddPoNumToPurchaseOrders < ActiveRecord::Migration[5.0]
  def change
    add_column :purchase_orders, :po_num, :string
  end
end
