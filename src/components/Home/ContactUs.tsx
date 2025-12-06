"use client"
import { useState } from 'react'
import Image from "next/image"
import { Button } from "../ui/button"
import TextInput from "../ui/TextInput"
import { Notification } from '../Reusable/Notification'

export function Contact() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        message: '',
        email: '',
        subject: 'General Inquiry' // Default subject since the API requires it
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear notification when user starts typing
        if (notification) {
            setNotification(null)
        }
    }

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type })
    }

    const hideNotification = () => {
        setNotification(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setNotification(null)

        try {
            // Prepare data in the exact format the API expects
            const apiData = {
                fullName: `${formData.firstName} ${formData.lastName}`.trim(),
                emailAddress: formData.email, // Added email field
                subject: formData.subject,
                message: formData.message
            }

            console.log('Submitting to API:', apiData)

            // Validate required fields
            if (!apiData.fullName || !apiData.emailAddress || !apiData.message) {
                throw new Error('Please fill in all required fields')
            }

            // Make API call
            const response = await fetch('https://tapiq.aitechstaging.com/api/contactmessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            })

            if (!response.ok) {
                let errorMessage = 'Failed to send message'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorMessage
                } catch (parseError) {
                    errorMessage = response.statusText || errorMessage
                }
                throw new Error(errorMessage)
            }

            const responseData = await response.json()
            console.log('API Response:', responseData)

            // Show success notification
            showNotification(
                'Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
                'success'
            )

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                message: '',
                email: '',
                subject: 'General Inquiry'
            })

        } catch (error) {
            console.error('Error submitting form:', error)
            showNotification(
                error instanceof Error
                    ? error.message
                    : 'An error occurred while sending your message. Please try again.',
                'error'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                />
            )}

            <section className={`py-16 px-6 font-manrope bg-cloudwhite`}>
                <div className="w-full md:w-1/2 mx-auto">
                    <div className="w-full mx-auto text-center mb-8 md:mb-12">
                        <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-indigo mb-4">
                            Contact Us
                        </h1>
                        <p className="text-base md:text-lg text-indigo leading-relaxed font-satoshi">
                            Have any questions, feedback, or need assistance? Fill out the form below, and we'll get back to you as soon as possible.
                        </p>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center md:mb-8 mb-4">
                        <form onSubmit={handleSubmit} className="relative p-4 flex items-center justify-center overflow-hidden w-full mx-auto rounded-lg">
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/assets/bg.jpg"
                                    alt="Background"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            <div className="w-full max-w-md relative z-10 flex flex-col text-white">
                                <h2 className="font-semibold text-xl md:text-2xl mb-6">Get in touch!</h2>

                                <TextInput
                                    label="First Name"
                                    name="firstName"
                                    type="text"
                                    className="font-satoshi text-black"
                                    placeholder="Enter First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />

                                <TextInput
                                    label="Last Name"
                                    name="lastName"
                                    type="text"
                                    className="font-satoshi text-black"
                                    placeholder="Enter Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />

                                <TextInput
                                    label="Email Address "
                                    name="email"
                                    type="email"
                                    className="font-satoshi text-black"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                                <div className="w-full">
                                    <label className="block mb-2 font-satoshi">Message *</label>
                                    <textarea
                                        name="message"
                                        className="w-full h-[60px] pr-10 bg-white focus:outline-none disabled:cursor-not-allowed placeholder:text-gray focus:ring-blue-200 focus:ring-4 rounded-md px-3 font-satoshi text-black"
                                        placeholder="Your message/question"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base md:text-lg w-full px-8 py-6 complex-gradient-border text-white my-6 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : 'Send Message'}
                                </Button>
                            </div>
                        </form>

                        <div className="flex flex-col">
                            <div className="w-full mx-auto text-center mb-2 md:mb-6">
                                <h1 className="text-3xl font-semibold text-indigo mb-4">
                                    How to Reach Us
                                </h1>
                                <p className="text-base md:text-lg text-indigo leading-relaxed font-satoshi">
                                    For any inquiries, feel free to reach out to us through the following contact details:
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center -my-6">
                                    <div className="">
                                        <Image
                                            src="/assets/email.svg"
                                            alt="Email icon"
                                            width={48}
                                            height={48}
                                            className="w-auto"
                                            priority
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 -ml-2">
                                        <h3 className="font-semibold text-xl md:text-2xl text-indigo">Email</h3>
                                        <p className="text-gray font-satoshi">email@example.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center -my-6">
                                    <div className="">
                                        <Image
                                            src="/assets/phone.svg"
                                            alt="Phone icon"
                                            width={48}
                                            height={48}
                                            className="w-auto"
                                            priority
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 -ml-2">
                                        <h3 className="font-semibold text-xl md:text-2xl text-indigo">Phone</h3>
                                        <p className="text-gray font-satoshi">+1 (555) 000-0000</p>
                                    </div>
                                </div>
                                <div className="flex items-center -my-6">
                                    <div className="">
                                        <Image
                                            src="/assets/location.svg"
                                            alt="Location icon"
                                            width={48}
                                            height={48}
                                            className="w-auto"
                                            priority
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 -ml-2">
                                        <h3 className="font-semibold text-xl md:text-2xl text-indigo">Office</h3>
                                        <p className="text-gray font-satoshi">123 Sample St, Sydney NSW 2000 AU</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}