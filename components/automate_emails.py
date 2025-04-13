import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Sender and receiver details
sender_email = "saathviga9605@gmail.com"
receiver_email = "balajikothandan2270@gmail.com"
password = "ssnk fgaf lrrw sodu"

# Create the email
message = MIMEMultipart()
message["From"] = sender_email
message["To"] = receiver_email
message["Subject"] = "Automated Email from Python"

# Email body
body = "Hi! I'm Saathviga!"
message.attach(MIMEText(body, "plain"))

# Connect to the Gmail SMTP server
try:
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()  # Secure connection
        server.login(sender_email, password)  # Login
        server.sendmail(sender_email, receiver_email, message.as_string())  # Send email
    print("Email sent successfully!")
except Exception as e:
    print("Error:", e)
