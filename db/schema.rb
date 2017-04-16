# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170416144718) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "customer_accounts", force: :cascade do |t|
    t.string   "customer_name"
    t.string   "address"
    t.string   "email"
    t.string   "telephone_number"
    t.string   "fax_number"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "customer_payments", force: :cascade do |t|
    t.date     "payment_date"
    t.decimal  "amount_paid"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.integer  "customer_account_id"
    t.integer  "purchase_order_id"
    t.index ["customer_account_id"], name: "index_customer_payments_on_customer_account_id", using: :btree
    t.index ["purchase_order_id"], name: "index_customer_payments_on_purchase_order_id", using: :btree
  end

  create_table "inventory_histories", force: :cascade do |t|
    t.date     "date_changed"
    t.string   "type"
    t.integer  "quantity"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "product_id"
    t.index ["product_id"], name: "index_inventory_histories_on_product_id", using: :btree
  end

  create_table "order_lines", force: :cascade do |t|
    t.integer  "quantity"
    t.decimal  "order_price"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.integer  "purchase_order_id"
    t.integer  "product_id"
    t.index ["product_id"], name: "index_order_lines_on_product_id", using: :btree
    t.index ["purchase_order_id"], name: "index_order_lines_on_purchase_order_id", using: :btree
  end

  create_table "products", force: :cascade do |t|
    t.string   "product_name"
    t.string   "product_type"
    t.string   "product_specs"
    t.decimal  "unit_price"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "purchase_orders", force: :cascade do |t|
    t.date     "purchase_date"
    t.decimal  "subtotal"
    t.decimal  "discount"
    t.decimal  "negotiated_price"
    t.string   "status"
    t.string   "payment_terms"
    t.date     "due_date"
    t.decimal  "outstanding_balance"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.integer  "customer_account_id"
    t.index ["customer_account_id"], name: "index_purchase_orders_on_customer_account_id", using: :btree
  end

  add_foreign_key "customer_payments", "customer_accounts"
  add_foreign_key "customer_payments", "purchase_orders"
  add_foreign_key "inventory_histories", "products"
  add_foreign_key "order_lines", "products"
  add_foreign_key "order_lines", "purchase_orders"
  add_foreign_key "purchase_orders", "customer_accounts"
end
