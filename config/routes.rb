Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :api, only:[] do
    collection do
        get 'db', to: 'api#get'
        get 'db/search', to: 'api#search'
    end
  end

  resources :customer_accounts, path: 'customers'
  resources :purchase_orders, path: 'orders'
  resources :products, path: 'products'
  resources :customer_payments, path: 'payments'
  resources :inventory_histories
end