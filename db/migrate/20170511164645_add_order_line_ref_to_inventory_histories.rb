class AddOrderLineRefToInventoryHistories < ActiveRecord::Migration[5.0]
  def change
    add_reference :inventory_histories, :order_line, index: true, foreign_key: true
  end
end
