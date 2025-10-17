/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Mail, Phone, Edit, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'
import { ApiResponse, User } from '@/types'
// Local ChangePasswordInput interface
interface ChangePasswordInput {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
import { changePasswordSchema } from '@/lib/validation'

// Validation Schemas
const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    bio: z.string().optional(),
    phone: z.string().optional(),
    picture: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})


type UpdateProfileInput = z.infer<typeof updateProfileSchema>


export default function ProfilePage() {
    const [profile, setProfile] = useState< User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

    // Profile Update Form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
        reset: resetProfile,
    } = useForm<UpdateProfileInput>({
        resolver: zodResolver(updateProfileSchema),
    })

    // Change Password Form
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
    })

    // Fetch Profile
    useEffect(() => {
        fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchProfile = async () => {
        try {
            setIsLoading(true)
            const response = await apiClient.get<User>('/auth/profile')

            if (response.success) {
                const user = response.data
                setProfile(user)
                resetProfile({
                    name: user.name,
                    bio: user.bio || '',
                    phone: user.phone || '',
                    picture: user.picture || '',
                })
            }
        } catch (error) {
            toast.error('Failed to load profile')
        } finally {
            setIsLoading(false)
        }
    }

    // Update Profile Handler
    const onUpdateProfile = async (data: UpdateProfileInput) => {
        try {
            setIsUpdating(true)
            const response = await apiClient.patch('/auth/profile', data)

            if (response.success) {
                setProfile(response.data as User)
                setIsEditing(false)
                toast.success('Profile updated successfully!')
            } else {
                toast.error(response.message || 'Failed to update profile')
            }
        } catch (error) {
            console.error('Update Profile Error:', error)
            toast.error('An error occurred while updating profile')
        } finally {
            setIsUpdating(false)
        }
    }

    // Change Password Handler
    const onChangePassword = async (data: ChangePasswordInput) => {
        try {
            setIsChangingPassword(true)
            const response = await apiClient.post('/auth/change-password', {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            })

            if (response.success) {
                toast.success('Password changed successfully!')
                setPasswordDialogOpen(false)
                resetPassword()
            } else {
                toast.error(response.message || 'Failed to change password')
            }
        } catch (error: any) {
            console.error('Change Password Error:', error)
            toast.error(error.message || 'An error occurred')
        } finally {
            setIsChangingPassword(false)
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        if (profile) {
            resetProfile({
                name: profile.name,
                bio: profile.bio || '',
                phone: profile.phone || '',
                picture: profile.picture || '',
            })
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Profile not found</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src={profile.picture || undefined} alt={profile.name} />
                            <AvatarFallback className="text-2xl">
                                {profile.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">{profile.name}</h3>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                {profile.role}
                            </span>
                        </div>
                        <Separator />
                        <div className="w-full space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span className="break-all">{profile.email}</span>
                            </div>
                            {profile.phone && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>{profile.phone}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Details & Update Form */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your personal information
                            </CardDescription>
                        </div>
                        {!isEditing ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Your name"
                                    {...registerProfile('name')}
                                    disabled={!isEditing}
                                    className={profileErrors.name ? 'border-destructive' : ''}
                                />
                                {profileErrors.name && (
                                    <p className="text-xs text-destructive">{profileErrors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={profile.email}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Email cannot be changed
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="+880-1234567890"
                                    {...registerProfile('phone')}
                                    disabled={!isEditing}
                                    className={profileErrors.phone ? 'border-destructive' : ''}
                                />
                                {profileErrors.phone && (
                                    <p className="text-xs text-destructive">{profileErrors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="picture">Profile Picture URL</Label>
                                <Input
                                    id="picture"
                                    placeholder="https://example.com/avatar.jpg"
                                    {...registerProfile('picture')}
                                    disabled={!isEditing}
                                    className={profileErrors.picture ? 'border-destructive' : ''}
                                />
                                {profileErrors.picture && (
                                    <p className="text-xs text-destructive">{profileErrors.picture.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                    {...registerProfile('bio')}
                                    disabled={!isEditing}
                                    className={profileErrors.bio ? 'border-destructive' : ''}
                                />
                                {profileErrors.bio && (
                                    <p className="text-xs text-destructive">{profileErrors.bio.message}</p>
                                )}
                            </div>

                            {isEditing && (
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isUpdating}>
                                        {isUpdating ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Security Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                        Manage your password and account security
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="font-medium">Password</h4>
                            <p className="text-sm text-muted-foreground">
                                Change your password to keep your account secure
                            </p>
                        </div>
                        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Lock className="h-4 w-4 mr-2" />
                                    Change Password
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="oldPassword">Current Password *</Label>
                                        <Input
                                            id="oldPassword"
                                            type="password"
                                            placeholder="Enter current password"
                                            {...registerPassword('oldPassword')}
                                            className={passwordErrors.oldPassword ? 'border-destructive' : ''}
                                        />
                                        {passwordErrors.oldPassword && (
                                            <p className="text-xs text-destructive">
                                                {passwordErrors.oldPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password *</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Enter new password"
                                            {...registerPassword('newPassword')}
                                            className={passwordErrors.newPassword ? 'border-destructive' : ''}
                                        />
                                        {passwordErrors.newPassword && (
                                            <p className="text-xs text-destructive">
                                                {passwordErrors.newPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm new password"
                                            {...registerPassword('confirmPassword' as const)}
                                            className={passwordErrors.confirmPassword ? 'border-destructive' : ''}
                                        />
                                        {passwordErrors.confirmPassword && (
                                            <p className="text-xs text-destructive">
                                                {passwordErrors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-muted p-3 rounded-md text-xs space-y-1">
                                        <p className="font-medium">Password requirements:</p>
                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                            <li>At least 8 characters long</li>
                                            <li>One uppercase letter</li>
                                            <li>One lowercase letter</li>
                                            <li>One number</li>
                                            <li>One special character</li>
                                        </ul>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setPasswordDialogOpen(false)
                                                resetPassword()
                                            }}
                                            disabled={isChangingPassword}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isChangingPassword}>
                                            {isChangingPassword ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                                    Changing...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    Change Password
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Created:</span>
                        <span className="font-medium">
                            {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-medium">
                            {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Account ID:</span>
                        <span className="font-medium">#{profile.id}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}