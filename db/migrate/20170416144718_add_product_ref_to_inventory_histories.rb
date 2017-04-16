class AddProductRefToInventoryHistories < ActiveRecord::Migration[5.0]
  def change
    add_reference :inventory_histories, :product, index: true, foreign_key: true
  end
end
