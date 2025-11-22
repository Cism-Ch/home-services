"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
    selectedDate?: Date
    selectedTime?: string
    onDateChange: (date: Date | undefined) => void
    onTimeChange: (time: string) => void
}

const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
]

export function DateTimePicker({ selectedDate, selectedTime, onDateChange, onTimeChange }: DateTimePickerProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Choisissez une date</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={onDateChange}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="rounded-md border"
                    />
                </CardContent>
            </Card>

            {selectedDate && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Choisissez un créneau</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {timeSlots.map((time) => (
                                <Button
                                    key={time}
                                    variant={selectedTime === time ? "default" : "outline"}
                                    className={cn(
                                        "w-full",
                                        selectedTime === time && "ring-2 ring-primary ring-offset-2"
                                    )}
                                    onClick={() => onTimeChange(time)}
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
