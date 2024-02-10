/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthUser, useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification, useQuery } from '@utils'
import { AxiosResponse } from 'axios'

// UI
import { Card } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Heart, Instagram, CornerDownLeft, Phone, Send } from 'lucide-react'
import ReactImageGallery from 'react-image-gallery'
import { formatAge } from '@/lib/utils'

export default function PetPage() {

    // Setups
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const signout = useSignOut()
    const authHeader = useAuthHeader()
    const { t } = useTranslation()
    const query = useQuery()

    // States
    const [petData, setPetData] = useState<Pet_Response>()
    const [ownerData, setOwnerData] = useState<User_Response>()
    const [name, setName] = useState<string>('')
    const [age, setAge] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [imageLinks, setImageLinks] = useState<{ original: string, thumbnail: string }[]>([])

    // Functions
    function fetchPet() {
        axios.post(`${API.baseURL}/pets/find`).then((res: AxiosResponse) => {
            if (!res.data.err) {
                const petOne = (res.data as Pet_Response[]).filter(petOne => petOne._id === query.get('id'))[0]
                setPetData(petOne)
                setName(petOne.name)
                setAge(petOne.age)
                setDescription(petOne.description)
            } else {
                notification.custom.error(res.data.err)
            }
        })
    }

    function fetchOwner() {
        if (petData) {
            axios.post(`${API.baseURL}/users/find`, { query: { _id: petData?.userID } }).then((res: AxiosResponse) => {
                if (!res.data.err) {
                    setOwnerData(res.data)
                } else {
                    notification.custom.error(res.data.err)
                }
            })
        }
    }

    function checkToken() {
        const token = `${localStorage.getItem('_auth_type')} ${localStorage.getItem('_auth')}`
        const isEqualTokens = authHeader() == token
        if (!isEqualTokens) {
            signout()
        }
    }

    function updatePetInfo() {
        notification.custom.promise(
            axios.post(`${API.baseURL}/pets/edit`, {
                query: { _id: petData?._id },
                updated: {
                    name,
                    age,
                    description
                }
            })
        )
    }

    // Handlers
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value)
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/auth/login')
            return
        }

        fetchPet()
        checkToken()
        // @ts-expect-error because it is imported from the web
        ym(96355513, 'hit', window.origin)
    }, [])

    useEffect(() => {
        fetchOwner()

        const images: { original: string, thumbnail: string }[] = []
        petData?.imagesPath.map(imageLink => {
            images.push({
                original: imageLink,
                thumbnail: imageLink
            })
        })
        setImageLinks(images)
    }, [petData])

    return (
        <>
            {petData && (
                (query.get('edit') === 'true' && ownerData?._id == user._id) ? (
                    <Card className='m-2 p-4 mb-20'>
                        <div className='mb-3'>
                            <ReactImageGallery items={imageLinks} showFullscreenButton={false} showThumbnails={false} showPlayButton={false} />
                        </div>
                        <div className='gap-2 flex flex-col'>
                            <div className='flex gap-2 w-full'>
                                <div className='grid w-full items-center gap-1.5'>
                                    <Label htmlFor='pet_name'>{t('pet.name')}</Label>
                                    <Input id='pet_name' defaultValue={name} onChange={handleNameChange} />
                                </div>
                                <div className='grid w-full items-center gap-1.5'>
                                    <Label htmlFor='pet_age'>{t('pet.age')}</Label>
                                    <Input id='pet_age' defaultValue={age} onChange={handleAgeChange} type='number' />
                                </div>
                            </div>
                            <div className='grid w-full items-center gap-1.5'>
                                <Label htmlFor='pet_description'>{t('pet.description')}</Label>
                                <Input id='pet_description' defaultValue={description} onChange={handleDescriptionChange} multiple />
                            </div>
                        </div>
                        <Button className='w-full' onClick={updatePetInfo}>{t('pet.update_btn')}</Button>
                    </Card>
                ) : (
                    <>
                        {query.get('more') === 'true' && (
                            <LikeReturnBottom pet={petData} />
                        )}
                        <div className='m-2 p-4 mb-20'>
                            <div>
                                <ReactImageGallery items={imageLinks} showFullscreenButton={false} showThumbnails={false} showPlayButton={false} />
                            </div>
                            <div className='mt-2'>
                                <p className='text-2xl font-bold'>{petData.name}, {formatAge(petData.age)}</p>
                                <p>{petData.description}</p>
                            </div>
                            {query.get('contacts') === 'true' && (
                                <Accordion type='single' collapsible>
                                    <AccordionItem value={`${petData._id}_owner_contacts`}>
                                        <AccordionTrigger>Contacts</AccordionTrigger>
                                        <AccordionContent>
                                            <p>{ownerData?.name}</p>
                                            {ownerData?.social.instagram && (
                                                <Button variant={'link'} className='flex gap-2' onClick={() => { window.open(`https://instagram.com/${ownerData?.social.instagram}`, '_blank') }}>
                                                    <Instagram />{ownerData?.social.instagram}
                                                </Button>
                                            )}
                                            {ownerData?.social.telegram && (
                                                <Button className='flex gap-2' onClick={() => { window.open(`https://t.me/${ownerData?.social.telegram}`, '_blank') }}>
                                                    <Send />{ownerData?.social.telegram}
                                                </Button>
                                            )}
                                            {ownerData?.phone && (
                                                <Button className='flex gap-2' variant={'link'} onClick={() => { window.open(`tel:${ownerData?.phone}`, '_blank') }}>
                                                    <Phone />{ownerData?.phone}
                                                </Button>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                        </div>
                    </>
                )
            )}
        </>
    )
}

function LikeReturnBottom(props: { pet: Pet_Response }) {
    // Setups
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const { t } = useTranslation()
    const navigate = useNavigate()

    // States
    const [userData, setUserData] = useState<User_Response>()
    const [liked, setLiked] = useState<boolean>(false)

    function addLikedPet() {
        if (!userData) return
        const userPrevData = structuredClone(userData)
        userPrevData.liked.push(props.pet._id)
        // @ts-expect-error Using interface User_Response that have strict definitions throws error when trying to exclude password from data
        userPrevData.password = undefined
        axios.post(`${API.baseURL}/users/update/${userData._id}`, { update: userPrevData }).then((res: AxiosResponse) => {
            if (!res.data.err) {
                notification.custom.success(t('pet.liked'))
                setLiked(true)
            } else {
                notification.custom.error(res.data.err)
            }
        })

    }

    function getUser() {
        axios.post(`${API.baseURL}/users/find`, { query: { _id: user._id } }).then((res: AxiosResponse) => {
            if (!res.data.err) {
                setUserData(res.data)
            } else {
                notification.custom.error(res.data.err)
            }
        })
    }

    useEffect(() => {
        getUser()
        // @ts-expect-error because it is imported from the web
        ym(96355513, 'hit', window.origin)
    }, [])

    return (
        <>
            <div className='absolute w-screen flex items-center justify-center bottom-[6rem]'>
                <div className='flex items-center gap-3'>
                    <Button onClick={() => { navigate(`/pwa?start_id=${props.pet._id}&type=${props.pet.type}`) }}><CornerDownLeft /></Button>
                    <Button style={{ color: '#FF0000' }} onClick={addLikedPet}><Heart fill={liked ? '#FF0000' : 'transparent'} /></Button>
                </div>
            </div>
        </>
    )
}
