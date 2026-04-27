"""
scoring.py

Contains the rule-based logic to calculate employee risk scores and generate explanations.
"""

def update_risk_score(current_score: int, action: str) -> int:
    """
    Calculates the new risk score based on the action taken.
    Score deltas per action:
      - clicked:  +15 points
      - ignored:  +5 points  
      - reported: -10 points
    Score is clamped between 0 and 100.
    """
    delta = 0
    if action == "clicked":
        delta = 15
    elif action == "ignored":
        delta = 5
    elif action == "reported":
        delta = -10
        
    new_score = current_score + delta
    
    # Clamp the score
    if new_score < 0:
        return 0
    if new_score > 100:
        return 100
    return new_score

def get_risk_label(score: int) -> str:
    """
    Returns the risk label corresponding to the score.
    """
    if 0 <= score <= 30:
        return "Low Risk"
    elif 31 <= score <= 60:
        return "Medium Risk"
    elif 61 <= score <= 80:
        return "High Risk"
    else:
        return "Critical Risk"

def generate_risk_explanation(score: int, label: str, last_action: str = None, attack_type: str = None) -> str:
    """
    Generates a dynamic plain English explanation of the user's risk profile.
    """
    explanation = f"You are currently classified as {label} with a score of {score}/100."
    
    if last_action == "clicked":
        explanation += f" Your risk increased recently because you clicked on a simulated '{attack_type}' attack."
        if score > 60:
            explanation += f" You appear to be vulnerable to {attack_type} tactics. We recommend completing the targeted training."
    elif last_action == "reported":
        explanation += " Your risk decreased recently because you successfully identified and reported a phishing simulation. Great job!"
    elif last_action == "ignored":
        explanation += " Your risk slightly increased because you ignored a simulation rather than actively reporting it."
        
    return explanation
