import React, { useState, useContext} from "react"
import {Modal, ModalHeader, ModalBody} from "reactstrap"
import {UserContext} from '../user/UserProvider'
import AddCommentForm from '../comment/AddCommentForm'
import { CommentContext, CommentProvider } from "../comment/CommentProvider"
import { LikeContext } from "../like/LikeProvider"
import { FavoriteContext } from "../favorite/FavoriteProvider"
import AddApartmentForm from './AddApartmentForm'
import Comment from "../comment/Comment";
import { RatingList } from "../rating/RatingList"
import './Apartment.css'
import { RatingContext } from "../rating/RatingProvider"
import UserRating from "../rating/UserRating"

export default ({apartment}) => {
    const {users} = useContext(UserContext)  
    const {comments} = useContext(CommentContext)
    const {likes, addLike, deleteLike} = useContext(LikeContext)
    const {favorites, addFavorite} = useContext(FavoriteContext)

    const [commentModal, setCommentModal] = useState(false)
    const toggleComment = () => setCommentModal(!commentModal)

    const [user_Comments, setUserComments] = useState(false)
    const toggleUserComments = () => setUserComments(!user_Comments)

    const loggedInUserId = parseInt(localStorage.getItem("reviewApartment_user"))
    const activeUser = users.find(u=>u.id === loggedInUserId)
    const addNewApartmentToFavorites = () => {
        if(activeUser){
            const favoriteObject = {
                apartmentId:apartment.id,
                userId: parseInt(localStorage.getItem("reviewApartment_user"))
            }
            /* check if apartment to be added to favorites doesn't 
            exist in the favorites section*/
            const apartmentExists = favorites.find(favorite => favorite.apartmentId === apartment.id)
            if(!apartmentExists){
                addFavorite(favoriteObject)                
            }
        }else{
            console.log("favorites is not working")
        }
    }
    let starDisplay = true
    //get currently loggedin user 
    const user = users.find(u => parseInt(u.id) === loggedInUserId)||{}

    const userComment = comments.filter(comt => comt.apartmentId === apartment.id)
    let userComments = userComment.length

    const userLikedApartment = likes.filter(like => like.apartmentId === apartment.id)
    const userLiked = likes.filter(like => like.userId === loggedInUserId)
    const alreadyLiked = userLiked.find(u => u.apartmentId === apartment.id)||{}
    
    const [like, setLike] = useState(false)
    const toggleLike = () => setLike(!like)

    const [newApartmentModal, setNewApartmentModal] = useState(false)
    const toggleNewApartmentForm = () => setNewApartmentModal(!newApartmentModal)

    const addLikeToApi = () => { 
        if(user.id){
            if(!userLikedApartment.apartmentId){
                if(like){
                    const userLikedApartment = {
                        userId: loggedInUserId,
                        apartmentId:apartment.id
                    }
                    addLike(userLikedApartment)
                }else {
                    deleteLike(alreadyLiked.id)
                }
            }
        }        
    }

    return (
        <>
            <section className="apartment">
                <img 
                    className = "apartmentImage" 
                    src = {apartment.uploadImage} 
                    alt = {apartment.uploadImage} 
                />
                <h3 className="apartment__name">
                {
                    apartment.apartmentName.charAt(0).toUpperCase() +
                    apartment.apartmentName.slice(1)
                }</h3>
                <h6 className="apartment__city_state">
                {
                    (apartment.city.charAt(0).toUpperCase() +
                    apartment.city.slice(1))
                },{
                    (apartment.state.charAt(0).toUpperCase()) +
                    apartment.state.slice(1)
                }</h6>
                <p className="apartment__description">{apartment.description}</p>
                <div className = "likesComments">
                    <div className = "compliment likes">{userLikedApartment.length} likes</div>
                    <div 
                        color="info" 
                        size = "sm" 
                        className = "compliment comments"
                        onClick = {
                            toggleUserComments
                        }
                    >{userComments} comments</div>
                    {
                        <UserRating apt = {apartment} />  
                    }
                </div>
                <div className = "complimentButtons">
                    <div 
                        color="info" 
                        size="sm" 
                        className = "btns likeButton" 
                        onClick = {() => {
                            toggleLike()
                            addLikeToApi()
                        }
                    }>Like</div>
                    <div color="info" size="sm" className = "btns commentButton" onClick = {toggleComment}>Comment</div>            
                    <RatingList apt = {apartment} />
                    <div color="info" size="sm" className = "btns" onClick = {(evt)=> {
                        evt.preventDefault()
                        addNewApartmentToFavorites()
                    }}>Add to favorites</div>
                </div>
                
            </section>

            <Modal isOpen = {newApartmentModal} toggle = {toggleNewApartmentForm}>
                <ModalHeader toggle = {toggleNewApartmentForm}>Create New Apartment</ModalHeader>
                <ModalBody>
                    <AddApartmentForm toggler = {toggleNewApartmentForm} />
                </ModalBody>
            </Modal> 

            <Modal isOpen = {commentModal} toggle = {toggleComment}>
                <ModalHeader toggle = {toggleComment}>Comment Apartment</ModalHeader>
                <ModalBody>
                    <AddCommentForm toggler = {toggleComment} apartmentCommentId = {apartment.id}/>
                </ModalBody>
            </Modal> 

            <Modal isOpen = {user_Comments} toggle = {toggleUserComments}>
                <ModalHeader toggle = {toggleUserComments}>Comments</ModalHeader>
                <ModalBody>
                    <Comment toggler = {toggleUserComments} apartmentCommentId = {apartment.id}/>
                </ModalBody>
            </Modal> 
        </>
        )        
    }