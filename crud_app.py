from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

items = []
current_id = 1

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/items", methods=["GET"])
def get_items():
    return jsonify(items)

@app.route("/items", methods=["POST"])
def create_item():
    global current_id
    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "No data received"}), 400

    item = {
        "id": current_id,
        "name": data.get("name"),
        "description": data.get("description")
    }
    items.append(item)
    current_id += 1
    return jsonify(item), 201

@app.route("/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    data = request.get_json(force=True)
    for item in items:
        if item["id"] == item_id:
            item["name"] = data.get("name", item["name"])
            item["description"] = data.get("description", item["description"])
            return jsonify(item)
    return jsonify({"message": "Item not found"}), 404

@app.route("/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    global items
    items = [item for item in items if item["id"] != item_id]
    return jsonify({"message": "Item deleted"})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
