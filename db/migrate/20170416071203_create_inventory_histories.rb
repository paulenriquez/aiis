class CreateInventoryHistories < ActiveRecord::Migration[5.0]
  def change
    create_table :inventory_histories do |t|
      t.date :date_changed

      t.string :type
      t.integer :quantity
      
      t.timestamps
    end
  end
end
