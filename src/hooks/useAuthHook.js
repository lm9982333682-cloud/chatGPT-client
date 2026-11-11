import { useForm } from "react-hook-form";
import axiosInstance from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { setAccessToken, setUser } from "../store/features/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useAuthHook = () => {



    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            remember: true,
            name: "",
            confirmPassword: "",
            terms: false,
        },
    });

    const dispatch = useDispatch();

    const navigate = useNavigate();


    const onSubmitRegister = async (data) => {

        try {

            const res = await axiosInstance.post("/auth/register", data);

            const { accessToken, message, success, user } = res.data;

            if (success) {

                dispatch(setUser(user));
                dispatch(setAccessToken(accessToken));
                toast.success(message);
                reset();

                setTimeout(() => {
                    navigate('/')
                }, 1400);
            }


        } catch (err) {
            console.log(err);
            console.log(err.response);
        }

    };


    // Login Submit
    const onSubmitLogin = async (data) => {
        try {

            const res = await axiosInstance.post("/auth/login", data);

            const { accessToken, message, success, user } = res.data;

            if (success) {

                dispatch(setUser(user));
                dispatch(setAccessToken(accessToken));
                toast.success(message);
                reset();

                setTimeout(() => {
                    navigate('/')
                }, 1400);
            }


        } catch (err) {
            console.log(err);
            console.log(err.response);
            toast.error(err.response.data.message)
        }

    };

    return { register, watch, handleSubmit, errors, isSubmitting, onSubmitLogin, onSubmitRegister }
}

export default useAuthHook;
