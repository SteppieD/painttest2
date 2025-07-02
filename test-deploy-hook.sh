#!/bin/bash
echo "Testing deploy hook - $(date)" >> deploy-test.txt
git add deploy-test.txt
git commit -m "test: Verify deploy hook is working"
git push origin main