"""Simple placeholder for recommendation logic."""

def get_recommendations(user_id):
    """Return a dummy list of recommendations."""
    # TODO: Replace with real recommendation model
    return [
        {
            "id": 1,
            "title": "Introduction to Algebra",
            "type": "course",
        },
        {
            "id": 2,
            "title": "Practice Test: Geometry Basics",
            "type": "quiz",
        },
    ]

if __name__ == "__main__":
    print(get_recommendations("example-user"))
