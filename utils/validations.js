import Joi from 'joi'
import JoiPhoneNumber from 'joi-phone-number'
const validUserUpdateRequest = (data)=>{
    const schema = Joi.object({
        full_name: Joi.string().min(3).max(30).optional(),
       
        email:Joi.string().email().optional(),
       
        bio:Joi.string().min(20).max(100).optional(),

      })
      ;
    
      return schema.validate(data);
}
const validPasswordUpdateRequest = (data)=>{
    const schema = Joi.object({
        password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
       access_token:[Joi.string(),Joi.number()]
    })
}
const validResetPasswordRequest = (data)=>{
const schema = Joi.object({
    phone:Joi.extend(JoiPhoneNumber).string().phoneNumber({ defaultCountry: 'IN', format: 'e164' }).required().messages({
        'string.base': 'Phone number should be a string',
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required',
        'phoneNumber.invalid': 'Phone number is not valid',
      }),
    email:Joi.string().email()
    
}).xor('phone','email')
return schema.validate(data);
}
const validArtisanRegisterRequest = (data)=>{
    const shopAddressSchema = Joi.object({
        street: Joi.string().trim().required().messages({
          'string.base': 'Street address should be a string',
          'string.empty': 'Street address is required',
          'any.required': 'Street address is required',
        }),
        city: Joi.string().trim().required().messages({
          'string.base': 'City should be a string',
          'string.empty': 'City is required',
          'any.required': 'City is required',
        }),
        state: Joi.string().trim().required().messages({
          'string.base': 'State should be a string',
          'string.empty': 'State is required',
          'any.required': 'State is required',
        }),
        postalCode: Joi.string().trim().required().pattern(/^\d{6}$/).messages({
          'string.base': 'Postal code should be a string',
          'string.empty': 'Postal code is required',
          'any.required': 'Postal code is required',
          'string.pattern.base': 'Postal code is not valid',
        }),
        country: Joi.string().trim().required().messages({
          'string.base': 'Country should be a string',
          'string.empty': 'Country is required',
          'any.required': 'Country is required',
        }),
      });
    const schema = Joi.object({
        shop_name:Joi.string().max(100).min(10).required(),
        bio:Joi.string().max(200),
        
        shop_address:shopAddressSchema.required(),
       
    });
    return schema.validate(data)
}
const validArtisanUpdateRequest = (data)=>{
  const shopAddressSchema = Joi.object({
    street: Joi.string().trim().required().messages({
      'string.base': 'Street address should be a string',
      'string.empty': 'Street address is required',
      'any.required': 'Street address is required',
    }),
    city: Joi.string().trim().required().messages({
      'string.base': 'City should be a string',
      'string.empty': 'City is required',
      'any.required': 'City is required',
    }),
    state: Joi.string().trim().required().messages({
      'string.base': 'State should be a string',
      'string.empty': 'State is required',
      'any.required': 'State is required',
    }),
    postalCode: Joi.string().trim().required().pattern(/^\d{6}$/).messages({
      'string.base': 'Postal code should be a string',
      'string.empty': 'Postal code is required',
      'any.required': 'Postal code is required',
      'string.pattern.base': 'Postal code is not valid',
    }),
    country: Joi.string().trim().required().messages({
      'string.base': 'Country should be a string',
      'string.empty': 'Country is required',
      'any.required': 'Country is required',
    }),
  });
  const schema = Joi.object({
    shop_name:Joi.string().max(100).min(10).optional(),
    bio:Joi.string().max(200).optional(),
    shop_address:shopAddressSchema.optional()
  })
  return schema.validate(data);
}
const validAddProductRequest = (data)=>{
  const schema = Joi.object({
    category_id:Joi.string().required(),
    name:Joi.string().max('50').min(10).required(),
    description:Joi.string().min(200).max(500).required(),
    price:Joi.number().min(100).max(9999),
    stock_quantity:Joi.number().min(1).required()
  });
  return schema.validate(data)
}
const validProductUpdateRequest = (data)=>{
  const schema = Joi.object({
    name:Joi.string().max('50').min(10),
    description:Joi.string().min(200).max(500),
    price:Joi.number().min(100).max(9999),
    stock_quantity:Joi.number().min(1)
  })
  return schema.validate(data);
}
export {validUserUpdateRequest,validPasswordUpdateRequest,validResetPasswordRequest,validArtisanRegisterRequest,validArtisanUpdateRequest,
  validAddProductRequest,validProductUpdateRequest
}