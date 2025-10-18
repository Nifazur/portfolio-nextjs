/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { Mail, Trash2, Check, Search, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { apiClient } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { ApiResponse, ContactMessage } from '@/types'

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      await fetchMessages()
    }
    if (isMounted) load()
    return () => { isMounted = false }
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await apiClient.get<ApiResponse<ContactMessage[]>>('/contact')
      if (response.data?.data) {
        setMessages(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiClient.patch(`/contact/${id}/read`)
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, isRead: true } : msg
      ))
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true })
      }
    } catch (error) {
      toast.error('Failed to mark as read')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await apiClient.delete(`/contact/${deleteId}`)
      setMessages(messages.filter(msg => msg.id !== deleteId))
      if (selectedMessage?.id === deleteId) {
        setSelectedMessage(null)
      }
      toast.success('Message deleted successfully')
    } catch (error) {
      toast.error('Failed to delete message')
    } finally {
      setDeleteId(null)
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !message.isRead) ||
      (filter === 'read' && message.isRead)

    return matchesSearch && matchesFilter
  })

  const unreadCount = messages.filter(msg => !msg.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Contact form submissions ({unreadCount} unread)
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({messages.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('read')}
            >
              Read ({messages.length - unreadCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedMessage?.id === message.id ? 'bg-muted' : ''
                      } ${!message.isRead ? 'border-l-4 border-l-primary' : ''}`}
                    onClick={() => {
                      setSelectedMessage(message)
                      if (!message.isRead) {
                        handleMarkAsRead(message.id)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{message.name}</span>
                        {!message.isRead && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">{message.email}</p>
                    {message.subject && (
                      <p className="text-sm font-medium mb-1">{message.subject}</p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No messages found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">From:</span>
                    <Badge variant={selectedMessage.isRead ? 'secondary' : 'default'}>
                      {selectedMessage.isRead ? 'Read' : 'Unread'}
                    </Badge>
                  </div>
                  <p className="font-medium">{selectedMessage.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>

                {selectedMessage.subject && (
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Subject:</span>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Message:</span>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {!selectedMessage.isRead && (
                    <Button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(selectedMessage.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a message to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}