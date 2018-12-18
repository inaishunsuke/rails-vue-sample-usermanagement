json.extract! user, :id, :name, :mail, :age, :created_at, :updated_at
json.url user_url(user, format: :json)
