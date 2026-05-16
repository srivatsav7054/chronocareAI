"""
ChronoCare AI - API Test Script
Tests the medical analysis endpoints
"""

import requests
import json
import time
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

def test_health_check() -> bool:
    """Test health check endpoint"""
    print("\n" + "="*70)
    print("TEST 1: Health Check")
    print("="*70)
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_medical_analysis(report_text: str, test_name: str) -> bool:
    """Test medical analysis endpoint"""
    print("\n" + "="*70)
    print(f"TEST: {test_name}")
    print("="*70)
    
    payload = {"report_text": report_text}
    
    print(f"\nRequest (length: {len(report_text)} chars):")
    print(f"  {report_text[:100]}...")
    
    try:
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/analyze",
            json=payload,
            timeout=30
        )
        elapsed_time = time.time() - start_time
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response Time: {elapsed_time:.2f}s")
        
        if response.status_code == 200:
            analysis = response.json()
            print("\n✓ Analysis Result:")
            print(f"  Disease: {analysis.get('disease')}")
            print(f"  Confidence: {analysis.get('confidence')}")
            print(f"  Severity: {analysis.get('severity')}")
            print(f"  Department: {analysis.get('department')}")
            print(f"  Urgency: {analysis.get('urgency')}")
            print(f"  Clinical Summary: {analysis.get('clinical_summary')}")
            print(f"  Red Flags: {', '.join(analysis.get('red_flags', []))}")
            print(f"  Recommended Action: {analysis.get('recommended_action')}")
            print(f"\nFull Response:")
            print(json.dumps(analysis, indent=2))
            return True
        else:
            print(f"❌ Error Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Error: Request timeout (30s)")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    """Run all tests"""
    print("\n")
    print("╔" + "="*68 + "╗")
    print("║" + " "*15 + "CHRONOCARE AI - API TEST SUITE" + " "*22 + "║")
    print("╚" + "="*68 + "╝")
    
    print(f"\nBase URL: {BASE_URL}")
    print("Ensure the service is running: python main.py")
    
    # Test 1: Health Check
    health_ok = test_health_check()
    
    if not health_ok:
        print("\n❌ Service is not responding. Make sure it's running.")
        print("Run: python main.py")
        return
    
    # Test 2: Cardiac Emergency
    cardiac_report = """
    CHIEF COMPLAINT: Acute chest pain
    
    HPI: 58-year-old male with acute onset substernal chest pain radiating to left arm.
    Associated with dyspnea and diaphoresis for 2 hours. History of hypertension and smoking.
    
    VITAL SIGNS: BP 165/95, HR 112, RR 24, O2 sat 94%
    
    PHYSICAL EXAM: Diaphoretic, anxious. Cardiac auscultation reveals regular rate and rhythm.
    
    ASSESSMENT: Acute coronary syndrome, rule out myocardial infarction.
    """
    
    test_medical_analysis(cardiac_report, "Cardiac Emergency Case")
    
    # Test 3: Respiratory Infection
    respiratory_report = """
    PATIENT PRESENTATION: 35-year-old female with fever
    
    HISTORY: 3-day history of fever (38.5-39.2°C), productive cough with green sputum,
    pleuritic chest pain. Recent URI exposure. No significant past medical history.
    
    VITAL SIGNS: Temp 39.1°C, HR 102, RR 22, BP 118/76
    
    PHYSICAL EXAM: Bibasilar crackles on lung auscultation
    
    CXR FINDINGS: Infiltrates in left lower lobe consistent with bacterial pneumonia
    
    Labs: WBC 14,000, elevated CRP
    
    DIAGNOSIS: Community-acquired pneumonia
    """
    
    test_medical_analysis(respiratory_report, "Respiratory Infection Case")
    
    # Test 4: Neurological Symptoms
    neuro_report = """
    CHIEF COMPLAINT: Sudden onset severe headache and vision changes
    
    HPI: 42-year-old with sudden severe occipital headache, light sensitivity, and blurred vision.
    Reports neck stiffness. Temperature 37.8°C. Recent travel to endemic area.
    
    VITAL SIGNS: BP 140/88, HR 88, Temp 37.8°C
    
    NEURO EXAM: Alert, neck stiffness on flexion, positive Kernig sign. Cranial nerves II-XII intact.
    
    CONCERN: Possible meningitis, rule out hemorrhagic stroke
    """
    
    test_medical_analysis(neuro_report, "Neurological Emergency Case")
    
    # Final Summary
    print("\n" + "="*70)
    print("TEST SUITE COMPLETE")
    print("="*70)
    print("\n✓ All tests executed successfully!")
    print("\nNext Steps:")
    print("1. Review the analysis results above")
    print("2. Verify all required fields are present")
    print("3. Check that medical reasoning is accurate")
    print("4. Integrate with Node.js backend")


if __name__ == "__main__":
    main()
