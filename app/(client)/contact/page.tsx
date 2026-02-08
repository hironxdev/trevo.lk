"use client"

import type React from "react"

import { useState } from "react"
import {
Mail,
Phone,
MapPin,
Clock,
Send,
MessageCircle,
Facebook,
Instagram,
CheckCircle,
Loader2,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const contactInfo = [
{
icon: Phone,
title: "Phone",
value: "074 108 8630",
description: "Mon-Fri from 8am to 6pm",
href: "tel:074 108 8630",
},
{
icon: Mail,
title: "Email",
value: "trevolrental@gmail.com",
description: "We'll respond within 24 hours",
href: "mailto:trevolrental@gmail.com",
},
{
icon: MessageCircle,
title: "WhatsApp",
value: "+94741088630",
description: "Quick responses via chat",
href: "https://wa.me/94741088630",
},
{
icon: MapPin,
title: "Office",
value: "781/F, Gemunu Mawatha, Homagama",
description: "Visit us by appointment",
href: "https://maps.google.com/?q=781/F, Gemunu Mawatha, Homagama",
},
]

const inquiryTypes = [
{ value: "general", label: "General Inquiry" },
{ value: "booking", label: "Booking Support" },
{ value: "partner", label: "Partner Registration" },
{ value: "technical", label: "Technical Issue" },
{ value: "feedback", label: "Feedback & Suggestions" },
{ value: "complaint", label: "File a Complaint" },
]

export default function ContactPage() {
const [isSubmitting, setIsSubmitting] = useState(false)
const [isSubmitted, setIsSubmitted] = useState(false)
const [formData, setFormData] = useState({
name: "",
email: "",
phone: "",
inquiryType: "",
subject: "",
message: "",
})

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setIsSubmitting(true)

// Simulate API call  
await new Promise((resolve) => setTimeout(resolve, 1500))  

setIsSubmitting(false)  
setIsSubmitted(true)  
toast.success("Message sent successfully! We'll get back to you soon.")  

// Reset form after a delay  
setTimeout(() => {  
  setFormData({  
    name: "",  
    email: "",  
    phone: "",  
    inquiryType: "",  
    subject: "",  
    message: "",  
  })  
  setIsSubmitted(false)  
}, 3000)

}

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
setFormData((prev) => ({
...prev,
[e.target.name]: e.target.value,
}))
}

return (
<main className="min-h-screen pt-20">
{/* Hero Section */}
<section className="relative bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
<div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
<span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
Contact Us
</span>
<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
We'd Love to <span className="text-primary">Hear From You</span>
</h1>
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
Have a question, feedback, or need assistance? Our team is here to help. Reach out to us and we'll respond
as soon as possible.
</p>
</div>
</section>

{/* Contact Cards */}  
  <section className="py-12 bg-background">  
    <div className="max-w-7xl mx-auto px-6 lg:px-8">  
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">  
        {contactInfo.map((info, index) => (  
          <a  
            key={index}  
            href={info.href}  
            target={info.href.startsWith("http") ? "_blank" : undefined}  
            rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}  
            className="flex items-start gap-4 p-5 rounded-xl border bg-background hover:border-primary/30 hover:shadow-sm transition-all group"  
          >  
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">  
              <info.icon className="w-6 h-6 text-primary" />  
            </div>  
            <div>  
              <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>  
              <p className="text-primary font-medium text-sm mb-1">{info.value}</p>  
              <p className="text-xs text-muted-foreground">{info.description}</p>  
            </div>  
          </a>  
        ))}  
      </div>  
    </div>  
  </section>  

  {/* Contact Form & Info */}  
  <section className="py-16 bg-muted/30">  
    <div className="max-w-7xl mx-auto px-6 lg:px-8">  
      <div className="grid lg:grid-cols-5 gap-12">  
        {/* Form */}  
        <div className="lg:col-span-3">  
          <div className="bg-background rounded-2xl p-6 md:p-8 border">  
            <h2 className="text-2xl font-bold text-foreground mb-2">Send us a Message</h2>  
            <p className="text-muted-foreground mb-6">  
              Fill out the form below and we'll get back to you within 24 hours.  
            </p>  

            {isSubmitted ? (  
              <div className="text-center py-12">  
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">  
                  <CheckCircle className="w-8 h-8 text-green-600" />  
                </div>  
                <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent Successfully!</h3>  
                <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you soon.</p>  
              </div>  
            ) : (  
              <form onSubmit={handleSubmit} className="space-y-5">  
                <div className="grid sm:grid-cols-2 gap-5">  
                  <div className="space-y-2">  
                    <Label htmlFor="name">Full Name *</Label>  
                    <Input  
                      id="name"  
                      name="name"  
                      placeholder="Your full name"  
                      value={formData.name}  
                      onChange={handleChange}  
                      required  
                    />  
                  </div>  
                  <div className="space-y-2">  
                    <Label htmlFor="email">Email Address *</Label>  
                    <Input  
                      id="email"  
                      name="email"  
                      type="email"  
                      placeholder="you@example.com"  
                      value={formData.email}  
                      onChange={handleChange}  
                      required  
                    />  
                  </div>  
                </div>  

                <div className="grid sm:grid-cols-2 gap-5">  
                  <div className="space-y-2">  
                    <Label htmlFor="phone">Phone Number</Label>  
                    <Input  
                      id="phone"  
                      name="phone"  
                      type="tel"  
                      placeholder="+94 77 123 4567"  
                      value={formData.phone}  
                      onChange={handleChange}  
                    />  
                  </div>  
                  <div className="space-y-2">  
                    <Label htmlFor="inquiryType">Inquiry Type *</Label>  
                    <Select  
                      value={formData.inquiryType}  
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, inquiryType: value }))}  
                      required  
                    >  
                      <SelectTrigger>  
                        <SelectValue placeholder="Select inquiry type" />  
                      </SelectTrigger>  
                      <SelectContent>  
                        {inquiryTypes.map((type) => (  
                          <SelectItem key={type.value} value={type.value}>  
                            {type.label}  
                          </SelectItem>  
                        ))}  
                      </SelectContent>  
                    </Select>  
                  </div>  
                </div>  

                <div className="space-y-2">  
                  <Label htmlFor="subject">Subject *</Label>  
                  <Input  
                    id="subject"  
                    name="subject"  
                    placeholder="Brief subject of your inquiry"  
                    value={formData.subject}  
                    onChange={handleChange}  
                    required  
                  />  
                </div>  

                <div className="space-y-2">  
                  <Label htmlFor="message">Message *</Label>  
                  <Textarea  
                    id="message"  
                    name="message"  
                    placeholder="Describe your inquiry in detail..."  
                    rows={5}  
                    value={formData.message}  
                    onChange={handleChange}  
                    required  
                  />  
                </div>  

                <Button type="submit" size="lg" className="w-full rounded-full" disabled={isSubmitting}>  
                  {isSubmitting ? (  
                    <>  
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />  
                      Sending...  
                    </>  
                  ) : (  
                    <>  
                      <Send className="w-4 h-4 mr-2" />  
                      Send Message  
                    </>  
                  )}  
                </Button>  
              </form>  
            )}  
          </div>  
        </div>  

        {/* Sidebar */}  
        <div className="lg:col-span-2 space-y-6">  
          {/* Business Hours */}  
          <div className="bg-background rounded-2xl p-6 border">  
            <div className="flex items-center gap-3 mb-4">  
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">  
                <Clock className="w-5 h-5 text-primary" />  
              </div>  
              <h3 className="text-lg font-semibold text-foreground">Business Hours</h3>  
            </div>  
            <div className="space-y-3 text-sm">  
              <div className="flex justify-between">  
                <span className="text-muted-foreground">Monday - Friday</span>  
                <span className="font-medium text-foreground">8:00 AM - 6:00 PM</span>  
              </div>  
              <div className="flex justify-between">  
                <span className="text-muted-foreground">Saturday</span>  
                <span className="font-medium text-foreground">9:00 AM - 4:00 PM</span>  
              </div>  
              <div className="flex justify-between">  
                <span className="text-muted-foreground">Sunday</span>  
                <span className="font-medium text-foreground">Closed</span>  
              </div>  
            </div>  
            <p className="text-xs text-muted-foreground mt-4">  
              * Emergency support available 24/7 for active bookings  
            </p>  
          </div>  

          {/* Quick Links */}  
          <div className="bg-background rounded-2xl p-6 border">  
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>  
            <div className="space-y-3">  
              <Link  
                href="/how-it-works"  
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"  
              >  
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />  
                How Trevo Works  
              </Link>  
              <Link  
                href="/partner/register"  
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"  
              >  
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />  
                Become a Partner  
              </Link>  
              <Link  
                href="/vehicles"  
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"  
              >  
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />  
                Browse Vehicles  
              </Link>  
              <Link  
                href="/about"  
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"  
              >  
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />  
                About Us  
              </Link>  
            </div>  
          </div>  

          {/* Social Links */}  
          <div className="bg-background rounded-2xl p-6 border">  
            <h3 className="text-lg font-semibold text-foreground mb-4">Follow Us</h3>  
            <p className="text-sm text-muted-foreground mb-4">  
              Stay connected for updates, tips, and special offers.  
            </p>  
            <div className="flex gap-3">  
              <a  
                href="https://www.facebook.com/share/1C9AoW7nza/"  
                target="_blank"  
                rel="noopener noreferrer"  
                className="w-10 h-10 flex items-center justify-center rounded-full border text-muted-foreground hover:text-primary hover:border-primary transition-colors"  
              >  
                <Facebook className="w-5 h-5" />  
              </a>  
              <a  
                href="https://instagram.com"  
                target="_blank"  
                rel="noopener noreferrer"  
                className="w-10 h-10 flex items-center justify-center rounded-full border text-muted-foreground hover:text-primary hover:border-primary transition-colors"  
              >  
                <Instagram className="w-5 h-5" />  
              </a>  
              <a  
                href="https://chat.whatsapp.com/EfSuJAAzruEEHOZlTYEn08"  
                target="_blank"  
                rel="noopener noreferrer"  
                className="w-10 h-10 flex items-center justify-center rounded-full border text-muted-foreground hover:text-primary hover:border-primary transition-colors"  
              >  
                <MessageCircle className="w-5 h-5" />  
              </a>  
            </div>  
          </div>  

          {/* Partner CTA */}  
          <div className="bg-primary rounded-2xl p-6 text-primary-foreground">  
            <h3 className="text-lg font-semibold mb-2">Want to List Your Vehicle?</h3>  
            <p className="text-primary-foreground/80 text-sm mb-4">  
              Join our growing community of vehicle owners and start earning today!  
            </p>  
            <Button asChild variant="secondary" className="w-full rounded-full">  
              <Link href="/partner/register">Become a Partner</Link>  
            </Button>  
          </div>  
        </div>  
      </div>  
    </div>  
  </section>  

  {/* Map Section */}  
  <section className="py-16 bg-background">  
    <div className="max-w-7xl mx-auto px-6 lg:px-8">  
      <div className="text-center mb-8">  
        <h2 className="text-2xl font-bold text-foreground mb-2">Find Us</h2>  
        <p className="text-muted-foreground">Our headquarters is located in Colombo, Sri Lanka</p>  
      </div>  
      <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-muted border">  
        <iframe  
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.63398404072!2d79.78610079999999!3d6.921837899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"  
          width="100%"  
          height="100%"  
          style={{ border: 0 }}  
          allowFullScreen  
          loading="lazy"  
          referrerPolicy="no-referrer-when-downgrade"  
          title="Trevo Office Location"  
        />  
      </div>  
    </div>  
  </section>  
</main>

)
}

