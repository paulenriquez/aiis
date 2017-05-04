class AddRemarksToInventoryHistories < ActiveRecord::Migration[5.0]
  def change
    add_column :inventory_histories, :remarks, :text
  end
end
