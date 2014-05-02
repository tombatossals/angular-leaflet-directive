nukeVendorPrefix = ->
    if window.WebGLRenderingContext?
        vendors = ['WEBKIT', 'MOZ', 'MS', 'O']
        vendorRe = /^WEBKIT_(.*)|MOZ_(.*)|MS_(.*)|O_(.*)/

        getExtension = WebGLRenderingContext.prototype.getExtension
        WebGLRenderingContext.prototype.getExtension = (name) ->
            match = name.match vendorRe
            if match != null
                name = match[1]

            extobj = getExtension.call @, name
            if extobj == null
                for vendor in vendors
                    extobj = getExtension.call @, vendor + '_' + name
                    if extobj != null
                        return extobj
                return null
            else
                return extobj

        getSupportedExtensions = WebGLRenderingContext.prototype.getSupportedExtensions
        WebGLRenderingContext.prototype.getSupportedExtensions = ->
            supported = getSupportedExtensions.call @
            result = []

            for extension in supported
                match = extension.match vendorRe
                if match != null
                    extension = match[1]

                if extension not in result
                    result.push extension

            return result

textureFloatShims = ->
    createSourceCanvas = ->
        canvas = document.createElement 'canvas'
        canvas.width = 2
        canvas.height = 2
        ctx = canvas.getContext '2d'
        imageData = ctx.getImageData(0, 0, 2, 2)
        imageData.data.set(new Uint8ClampedArray([
            0,0,0,0,
            255,255,255,255,
            0,0,0,0,
            255,255,255,255,
        ]))
        ctx.putImageData(imageData, 0, 0)
        return canvas

    createSourceCanvas()

    checkFloatLinear = (gl, sourceType) ->
        ## drawing program ##
        program = gl.createProgram()
        vertexShader = gl.createShader(gl.VERTEX_SHADER)
        gl.attachShader(program, vertexShader)
        gl.shaderSource(vertexShader, '''
            attribute vec2 position;
            void main(){
                gl_Position = vec4(position, 0.0, 1.0);
            }
        ''')

        gl.compileShader(vertexShader)
        if not gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)
            throw gl.getShaderInfoLog(vertexShader)

        fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.attachShader(program, fragmentShader)
        gl.shaderSource(fragmentShader, '''
            uniform sampler2D source;
            void main(){
                gl_FragColor = texture2D(source, vec2(1.0, 1.0));
            }
        ''')
        gl.compileShader(fragmentShader)
        if not gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)
            throw gl.getShaderInfoLog(fragmentShader)

        gl.linkProgram(program)
        if not gl.getProgramParameter(program, gl.LINK_STATUS)
            throw gl.getProgramInfoLog(program)
        
        gl.useProgram(program)
        
        cleanup = ->
            gl.deleteShader(fragmentShader)
            gl.deleteShader(vertexShader)
            gl.deleteProgram(program)
            gl.deleteBuffer(buffer)
            gl.deleteTexture(source)
            gl.deleteTexture(target)
            gl.deleteFramebuffer(framebuffer)

            gl.bindBuffer(gl.ARRAY_BUFFER, null)
            gl.useProgram(null)
            gl.bindTexture(gl.TEXTURE_2D, null)
            gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        ## target FBO ##
        target = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, target)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            2, 2,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null,
        )

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

        framebuffer = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            target,
            0
        )
        
        ## source texture ##
        sourceCanvas = createSourceCanvas()
        source = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, source)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            sourceType,
            sourceCanvas,
        )

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                   
        ## create VBO ## 
        vertices = new Float32Array([
             1,  1,
            -1,  1,
            -1, -1,

             1,  1,
            -1, -1,
             1, -1,
        ])
        buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        positionLoc = gl.getAttribLocation(program, 'position')
        sourceLoc = gl.getUniformLocation(program, 'source')
        gl.enableVertexAttribArray(positionLoc)
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)
        gl.uniform1i(sourceLoc, 0)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        
        readBuffer = new Uint8Array(4*4)
        gl.readPixels(0, 0, 2, 2, gl.RGBA, gl.UNSIGNED_BYTE, readBuffer)
       
        result = Math.abs(readBuffer[0] - 127) < 10

        cleanup()
        return result

    checkTexture = (gl, targetType) ->
        target = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, target)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            2, 2,
            0,
            gl.RGBA,
            targetType,
            null,
        )

        if gl.getError() == 0
            gl.deleteTexture(target)
            return true
        else
            gl.deleteTexture(target)
            return false

    checkColorBuffer = (gl, targetType) ->
        target = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, target)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            2, 2,
            0,
            gl.RGBA,
            targetType,
            null,
        )
        
        framebuffer = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            target,
            0
        )
        
        check = gl.checkFramebufferStatus(gl.FRAMEBUFFER)

        gl.deleteTexture(target)
        gl.deleteFramebuffer(framebuffer)
        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        if check == gl.FRAMEBUFFER_COMPLETE
            return true
        else
            return false

    shimExtensions = []
    shimLookup = {}
    unshimExtensions = []

    checkSupport = ->
        canvas = document.createElement 'canvas'
        gl = null
        try
            gl = canvas.getContext 'experimental-webgl'
            if(gl == null)
                gl = canvas.getContext 'webgl'

        if gl?
            singleFloatExt = gl.getExtension 'OES_texture_float'
            if singleFloatExt == null
                if checkTexture gl, gl.FLOAT
                    singleFloatTexturing = true
                    shimExtensions.push 'OES_texture_float'
                    shimLookup.OES_texture_float = {shim:true}
                else
                    singleFloatTexturing = false
                    unshimExtensions.push 'OES_texture_float'
            else
                if checkTexture gl, gl.FLOAT
                    singleFloatTexturing = true
                    shimExtensions.push 'OES_texture_float'
                else
                    singleFloatTexturing = false
                    unshimExtensions.push 'OES_texture_float'

            if singleFloatTexturing
                extobj = gl.getExtension 'WEBGL_color_buffer_float'
                if extobj == null
                    if checkColorBuffer gl, gl.FLOAT
                        shimExtensions.push 'WEBGL_color_buffer_float'
                        shimLookup.WEBGL_color_buffer_float = {
                            shim: true
                            RGBA32F_EXT: 0x8814
                            RGB32F_EXT: 0x8815
                            FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 0x8211
                            UNSIGNED_NORMALIZED_EXT: 0x8C17
                        }
                    else
                        unshimExtensions.push 'WEBGL_color_buffer_float'
                else
                    if checkColorBuffer gl, gl.FLOAT
                        shimExtensions.push 'WEBGL_color_buffer_float'
                    else
                        unshimExtensions.push 'WEBGL_color_buffer_float'

                extobj = gl.getExtension 'OES_texture_float_linear'
                if extobj == null
                    if checkFloatLinear gl, gl.FLOAT
                        shimExtensions.push 'OES_texture_float_linear'
                        shimLookup.OES_texture_float_linear = {shim:true}
                    else
                        unshimExtensions.push 'OES_texture_float_linear'
                else
                    if checkFloatLinear gl, gl.FLOAT
                        shimExtensions.push 'OES_texture_float_linear'
                    else
                        unshimExtensions.push 'OES_texture_float_linear'
            
            halfFloatExt = gl.getExtension 'OES_texture_half_float'
            if halfFloatExt == null
                if checkTexture(gl, 0x8D61)
                    halfFloatTexturing = true
                    shimExtensions.push 'OES_texture_half_float'
                    halfFloatExt = shimLookup.OES_texture_half_float = {
                        HALF_FLOAT_OES: 0x8D61
                        shim:true
                    }
                else
                    halfFloatTexturing = false
                    unshimExtensions.push 'OES_texture_half_float'
            else
                if checkTexture(gl, halfFloatExt.HALF_FLOAT_OES)
                    halfFloatTexturing = true
                    shimExtensions.push 'OES_texture_half_float'
                else
                    halfFloatTexturing = false
                    unshimExtensions.push 'OES_texture_half_float'

            if halfFloatTexturing
                extobj = gl.getExtension 'EXT_color_buffer_half_float'
                if extobj == null
                    if checkColorBuffer gl, halfFloatExt.HALF_FLOAT_OES
                        shimExtensions.push 'EXT_color_buffer_half_float'
                        shimLookup.EXT_color_buffer_half_float = {
                            shim: true
                            RGBA16F_EXT: 0x881A
                            RGB16F_EXT: 0x881B
                            FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 0x8211
                            UNSIGNED_NORMALIZED_EXT: 0x8C17
                        }
                    else
                        unshimExtensions.push 'EXT_color_buffer_half_float'
                else
                    if checkColorBuffer gl, halfFloatExt.HALF_FLOAT_OES
                        shimExtensions.push 'EXT_color_buffer_half_float'
                    else
                        unshimExtensions.push 'EXT_color_buffer_half_float'
                
                extobj = gl.getExtension 'OES_texture_half_float_linear'
                if extobj == null
                    if checkFloatLinear gl, halfFloatExt.HALF_FLOAT_OES
                        shimExtensions.push 'OES_texture_half_float_linear'
                        shimLookup.OES_texture_half_float_linear = {shim:true}
                    else
                        unshimExtensions.push 'OES_texture_half_float_linear'
                else
                    if checkFloatLinear gl, halfFloatExt.HALF_FLOAT_OES
                        shimExtensions.push 'OES_texture_half_float_linear'
                    else
                        unshimExtensions.push 'OES_texture_half_float_linear'
       
    if window.WebGLRenderingContext?
        checkSupport()

        unshimLookup = {}
        for name in unshimExtensions
            unshimLookup[name] = true

        getExtension = WebGLRenderingContext.prototype.getExtension
        WebGLRenderingContext.prototype.getExtension = (name) ->
            extobj = shimLookup[name]
            if extobj == undefined
                if unshimLookup[name]
                    return null
                else
                    return getExtension.call @, name
            else
                return extobj
        
        getSupportedExtensions = WebGLRenderingContext.prototype.getSupportedExtensions
        WebGLRenderingContext.prototype.getSupportedExtensions = ->
            supported = getSupportedExtensions.call(@)
            result = []

            for extension in supported
                if unshimLookup[extension] == undefined
                    result.push(extension)

            for extension in shimExtensions
                if extension not in result
                    result.push extension

            return result

        WebGLRenderingContext.prototype.getFloatExtension = (spec) ->
            spec.prefer ?= ['half']
            spec.require ?= []
            spec.throws ?= true

            singleTexture = @getExtension 'OES_texture_float'
            halfTexture = @getExtension 'OES_texture_half_float'
            singleFramebuffer = @getExtension 'WEBGL_color_buffer_float'
            halfFramebuffer = @getExtension 'EXT_color_buffer_half_float'
            singleLinear = @getExtension 'OES_texture_float_linear'
            halfLinear = @getExtension 'OES_texture_half_float_linear'

            single = {
                texture: singleTexture != null
                filterable: singleLinear != null
                renderable: singleFramebuffer != null
                score: 0
                precision: 'single'
                half: false
                single: true
                type: @FLOAT
            }
            
            half = {
                texture: halfTexture != null
                filterable: halfLinear != null
                renderable: halfFramebuffer != null
                score: 0
                precision: 'half'
                half: true
                single: false
                type: halfTexture?.HALF_FLOAT_OES ? null
            }

            candidates = []
            if single.texture
                candidates.push(single)
            if half.texture
                candidates.push(half)

            result = []
            for candidate in candidates
                use = true
                for name in spec.require
                    if candidate[name] == false
                        use = false
                if use
                    result.push candidate

            for candidate in result
                for preference, i in spec.prefer
                    importance = Math.pow 2, spec.prefer.length - i - 1
                    if candidate[preference]
                        candidate.score += importance

            result.sort (a, b) ->
                if a.score == b.score then 0
                else if a.score < b.score then 1
                else if a.score > b.score then -1

            if result.length == 0
                if spec.throws
                    throw 'No floating point texture support that is ' + spec.require.join(', ')
                else
                    return null
            else
                result = result[0]
                return {
                    filterable: result.filterable
                    renderable: result.renderable
                    type: result.type
                    precision: result.precision
                }

nukeVendorPrefix()
textureFloatShims()

class Shader
    constructor: (@gl, {vertex, fragment}) ->
        @program    = @gl.createProgram()
        @vs         = @gl.createShader @gl.VERTEX_SHADER
        @fs         = @gl.createShader @gl.FRAGMENT_SHADER
        @gl.attachShader @program, @vs
        @gl.attachShader @program, @fs
        @compileShader @vs, vertex
        @compileShader @fs, fragment
        @link()

        @value_cache = {}
        @uniform_cache = {}
        @attribCache = {}
    
    attribLocation: (name) ->
        location = @attribCache[name]
        if location is undefined
            location = @attribCache[name] = @gl.getAttribLocation @program, name
        return location
    
    compileShader: (shader, source) ->
        @gl.shaderSource shader, source
        @gl.compileShader shader

        if not @gl.getShaderParameter shader, @gl.COMPILE_STATUS
            throw "Shader Compile Error: #{@gl.getShaderInfoLog(shader)}"
    
    link: ->
        @gl.linkProgram @program

        if not @gl.getProgramParameter @program, @gl.LINK_STATUS
            throw "Shader Link Error: #{@gl.getProgramInfoLog(@program)}"

    use: ->
        @gl.useProgram @program
        return @
    
    uniformLoc: (name) ->
        location = @uniform_cache[name]
        if location is undefined
            location = @uniform_cache[name] = @gl.getUniformLocation @program, name
        return location
    
    int: (name, value) ->
        cached = @value_cache[name]
        if cached != value
            @value_cache[name] = value
            loc = @uniformLoc name
            @gl.uniform1i loc, value if loc
        return @
    
    vec2: (name, a, b) ->
        loc = @uniformLoc name
        @gl.uniform2f loc, a, b if loc
        return @
            
    float: (name, value) ->
        cached = @value_cache[name]
        if cached != value
            @value_cache[name] = value
            loc = @uniformLoc name
            @gl.uniform1f loc, value if loc
        return @

class Framebuffer
    constructor: (@gl) ->
        @buffer = @gl.createFramebuffer()

    destroy: ->
        @gl.deleteFRamebuffer @buffer

    bind: ->
        @gl.bindFramebuffer @gl.FRAMEBUFFER, @buffer
        return @

    unbind: ->
        @gl.bindFramebuffer @gl.FRAMEBUFFER, null
        return @

    check: ->
        result = @gl.checkFramebufferStatus @gl.FRAMEBUFFER
        switch result
            when @gl.FRAMEBUFFER_UNSUPPORTED
                throw 'Framebuffer is unsupported'
            when @gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT
                throw 'Framebuffer incomplete attachment'
            when @gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS
                throw 'Framebuffer incomplete dimensions'
            when @gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT
                throw 'Framebuffer incomplete missing attachment'
        return @

    color: (texture) ->
        @gl.framebufferTexture2D @gl.FRAMEBUFFER, @gl.COLOR_ATTACHMENT0, texture.target, texture.handle, 0
        @check()
        return @
    
    depth: (buffer) ->
        @gl.framebufferRenderbuffer @gl.FRAMEBUFFER, @gl.DEPTH_ATTACHMENT, @gl.RENDERBUFFER, buffer.id
        @check()
        return @

    destroy: ->
        @gl.deleteFramebuffer @buffer

class Texture
    constructor: (@gl, params={}) ->
        @channels = @gl[(params.channels ? 'rgba').toUpperCase()]

        if typeof(params.type) == 'number'
            @type = params.type
        else
            @type = @gl[(params.type ? 'unsigned_byte').toUpperCase()]

        switch @channels
            when @gl.RGBA then @chancount = 4
            when @gl.RGB then @chancount = 3
            when @gl.LUMINANCE_ALPHA then @chancount = 2
            else @chancount = 1

        @target = @gl.TEXTURE_2D
        @handle = @gl.createTexture()

    destroy: ->
        @gl.deleteTexture @handle
    
    bind: (unit=0) ->
        if unit > 15
            throw 'Texture unit too large: ' + unit

        @gl.activeTexture @gl.TEXTURE0+unit
        @gl.bindTexture @target, @handle

        return @

    setSize: (@width, @height) ->
        @gl.texImage2D @target, 0, @channels, @width, @height, 0, @channels, @type, null
        return @
    
    upload: (data) ->
        @width = data.width
        @height = data.height

        @gl.texImage2D @target, 0, @channels, @channels, @type, data
        return @
    
    linear: ->
        @gl.texParameteri @target, @gl.TEXTURE_MAG_FILTER, @gl.LINEAR
        @gl.texParameteri @target, @gl.TEXTURE_MIN_FILTER, @gl.LINEAR
        return @
    
    nearest: ->
        @gl.texParameteri @target, @gl.TEXTURE_MAG_FILTER, @gl.NEAREST
        @gl.texParameteri @target, @gl.TEXTURE_MIN_FILTER, @gl.NEAREST
        return @

    clampToEdge: ->
        @gl.texParameteri @target, @gl.TEXTURE_WRAP_S, @gl.CLAMP_TO_EDGE
        @gl.texParameteri @target, @gl.TEXTURE_WRAP_T, @gl.CLAMP_TO_EDGE
        return @
    
    repeat: ->
        @gl.texParameteri @target, @gl.TEXTURE_WRAP_S, @gl.REPEAT
        @gl.texParameteri @target, @gl.TEXTURE_WRAP_T, @gl.REPEAT
        return @

class Node
    constructor: (@gl, @width, @height) ->
        floatExt = @gl.getFloatExtension require: ['renderable']
        @texture = new Texture(@gl, type:floatExt.type).bind(0).setSize(@width, @height).nearest().clampToEdge()
        @fbo = new Framebuffer(@gl).bind().color(@texture).unbind()

    use: -> @fbo.bind()
    bind: (unit) -> @texture.bind(unit)
    end: -> @fbo.unbind()

    resize: (@width, @height) ->
        @texture.bind(0).setSize(@width, @height)

vertexShaderBlit = '''
    attribute vec4 position;
    varying vec2 texcoord;
    void main(){
        texcoord = position.xy*0.5+0.5;
        gl_Position = position;
    }
'''

fragmentShaderBlit = '''
    #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp int;
        precision highp float;
    #else
        precision mediump int;
        precision mediump float;
    #endif
    uniform sampler2D source;
    varying vec2 texcoord;
'''

class Heights
    constructor: (@heatmap, @gl, @width, @height) ->
        @shader = new Shader @gl,
            vertex: '''
                attribute vec4 position, intensity;
                varying vec2 off, dim;
                varying float vIntensity;
                uniform vec2 viewport;

                void main(){
                    dim = abs(position.zw);
                    off = position.zw;
                    vec2 pos = position.xy + position.zw;
                    vIntensity = intensity.x;
                    gl_Position = vec4((pos/viewport)*2.0-1.0, 0.0, 1.0);
                }
            '''
            fragment: '''
                #ifdef GL_FRAGMENT_PRECISION_HIGH
                    precision highp int;
                    precision highp float;
                #else
                    precision mediump int;
                    precision mediump float;
                #endif
                varying vec2 off, dim;
                varying float vIntensity;
                void main(){
                    float falloff = (1.0 - smoothstep(0.0, 1.0, length(off/dim)));
                    float intensity = falloff*vIntensity;
                    gl_FragColor = vec4(intensity);
                }
            '''

        @clampShader = new Shader @gl,
            vertex: vertexShaderBlit
            fragment: fragmentShaderBlit + '''
                uniform float low, high;
                void main(){
                    gl_FragColor = vec4(clamp(texture2D(source, texcoord).rgb, low, high), 1.0);
                }
            '''
        
        @multiplyShader = new Shader @gl,
            vertex: vertexShaderBlit
            fragment: fragmentShaderBlit + '''
                uniform float value;
                void main(){
                    gl_FragColor = vec4(texture2D(source, texcoord).rgb*value, 1.0);
                }
            '''
        
        @blurShader = new Shader @gl,
            vertex: vertexShaderBlit
            fragment: fragmentShaderBlit + '''
                uniform vec2 viewport;
                void main(){
                    vec4 result = vec4(0.0);
                    for(int x=-1; x<=1; x++){
                        for(int y=-1; y<=1; y++){
                            vec2 off = vec2(x,y)/viewport;
                            //float factor = 1.0 - smoothstep(0.0, 1.5, length(off));
                            float factor = 1.0;
                            result += vec4(texture2D(source, texcoord+off).rgb*factor, factor);
                        }
                    }
                    gl_FragColor = vec4(result.rgb/result.w, 1.0);
                }
            '''

        @nodeBack = new Node @gl, @width, @height
        @nodeFront = new Node @gl, @width, @height
        
        @vertexBuffer = @gl.createBuffer()
        @vertexSize = 8
        @maxPointCount = 1024*10
        @vertexBufferData = new Float32Array @maxPointCount*@vertexSize*6
        @vertexBufferViews = []
        for i in [0...@maxPointCount]
            @vertexBufferViews.push new Float32Array(@vertexBufferData.buffer, 0, i*@vertexSize*6)

        @bufferIndex = 0
        @pointCount = 0

    resize: (@width, @height) ->
        @nodeBack.resize @width, @height
        @nodeFront.resize @width, @height

    update: ->
        if @pointCount > 0
            @gl.enable @gl.BLEND

            @nodeFront.use()

            @gl.bindBuffer @gl.ARRAY_BUFFER, @vertexBuffer
            @gl.bufferData @gl.ARRAY_BUFFER, @vertexBufferViews[@pointCount], @gl.STREAM_DRAW

            positionLoc = @shader.attribLocation('position')
            intensityLoc = @shader.attribLocation('intensity')
            
            @gl.enableVertexAttribArray 1
            @gl.vertexAttribPointer(positionLoc, 4, @gl.FLOAT, false, 8*4, 0*4)
            @gl.vertexAttribPointer(intensityLoc, 4, @gl.FLOAT, false, 8*4, 4*4)
            @shader.use().vec2('viewport', @width, @height)
            @gl.drawArrays @gl.TRIANGLES, 0, @pointCount*6
            @gl.disableVertexAttribArray 1

            @pointCount = 0
            @bufferIndex = 0

            @nodeFront.end()
            @gl.disable @gl.BLEND

    clear: ->
        @nodeFront.use()
        @gl.clearColor(0,0,0,1)
        @gl.clear(@gl.COLOR_BUFFER_BIT)
        @nodeFront.end()

    clamp: (min, max) ->
        @gl.bindBuffer @gl.ARRAY_BUFFER, @heatmap.quad
        @gl.vertexAttribPointer(0, 4, @gl.FLOAT, false, 0, 0)
        @nodeFront.bind(0)
        @nodeBack.use()
        @clampShader.use().int('source', 0).float('low', min).float('high', max)
        @gl.drawArrays @gl.TRIANGLES, 0, 6
        @nodeBack.end()
        @swap()
    
    multiply: (value) ->
        @gl.bindBuffer @gl.ARRAY_BUFFER, @heatmap.quad
        @gl.vertexAttribPointer(0, 4, @gl.FLOAT, false, 0, 0)
        @nodeFront.bind(0)
        @nodeBack.use()
        @multiplyShader.use().int('source', 0).float('value', value)
        @gl.drawArrays @gl.TRIANGLES, 0, 6
        @nodeBack.end()
        @swap()

    blur: ->
        @gl.bindBuffer @gl.ARRAY_BUFFER, @heatmap.quad
        @gl.vertexAttribPointer(0, 4, @gl.FLOAT, false, 0, 0)
        @nodeFront.bind(0)
        @nodeBack.use()
        @blurShader.use().int('source', 0).vec2('viewport', @width, @height)
        @gl.drawArrays @gl.TRIANGLES, 0, 6
        @nodeBack.end()
        @swap()

    swap: ->
        tmp = @nodeFront
        @nodeFront = @nodeBack
        @nodeBack = tmp

    addVertex: (x, y, xs, ys, intensity) ->
        @vertexBufferData[@bufferIndex++] = x
        @vertexBufferData[@bufferIndex++] = y
        @vertexBufferData[@bufferIndex++] = xs
        @vertexBufferData[@bufferIndex++] = ys
        @vertexBufferData[@bufferIndex++] = intensity
        @vertexBufferData[@bufferIndex++] = intensity
        @vertexBufferData[@bufferIndex++] = intensity
        @vertexBufferData[@bufferIndex++] = intensity

    addPoint: (x, y, size=50, intensity=0.2) ->
        if @pointCount >= @maxPointCount - 1
            @update()

        #if @pointCount < @maxPointCount
        y = @height - y
        s = size/2
        @addVertex x, y, -s, -s, intensity
        @addVertex x, y, +s, -s, intensity
        @addVertex x, y, -s, +s, intensity
        
        @addVertex x, y, -s, +s, intensity
        @addVertex x, y, +s, -s, intensity
        @addVertex x, y, +s, +s, intensity

        @pointCount += 1

class WebGLHeatmap
    constructor: ({@canvas, @width, @height, intensityToAlpha, gradientTexture, alphaRange}={}) ->
        @canvas = document.createElement('canvas') unless @canvas
        try
            @gl = @canvas.getContext('experimental-webgl', depth:false, antialias:false)
            if @gl == null
                @gl = @canvas.getContext('webgl', depth:false, antialias:false)
                if @gl == null
                    throw 'WebGL not supported'
        catch error
            throw 'WebGL not supported'

        if window.WebGLDebugUtils?
            console.log 'debugging mode'
            @gl = WebGLDebugUtils.makeDebugContext @gl, (err, funcName, args) ->
                throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName

        @gl.enableVertexAttribArray 0
        @gl.blendFunc @gl.ONE, @gl.ONE

        if gradientTexture
            textureGradient = @gradientTexture = new Texture(@gl, channels:'rgba').bind(0).setSize(2, 2).nearest().clampToEdge()
            if typeof gradientTexture == 'string'
                image = new Image()
                image.onload = ->
                    textureGradient.bind().upload(image)
                image.src = gradientTexture
            else
                if gradientTexture.width > 0 and gradientTexture.height > 0
                    textureGradient.upload(gradientTexture)
                else
                    gradientTexture.onload = ->
                        textureGradient.upload(gradientTexture)

            getColorFun = '''
                uniform sampler2D gradientTexture;
                vec3 getColor(float intensity){
                    return texture2D(gradientTexture, vec2(intensity, 0.0)).rgb;
                }
            '''
        else
            textureGradient = null
            getColorFun = '''
                vec3 getColor(float intensity){
                    vec3 blue = vec3(0.0, 0.0, 1.0);
                    vec3 cyan = vec3(0.0, 1.0, 1.0);
                    vec3 green = vec3(0.0, 1.0, 0.0);
                    vec3 yellow = vec3(1.0, 1.0, 0.0);
                    vec3 red = vec3(1.0, 0.0, 0.0);

                    vec3 color = (
                        fade(-0.25, 0.25, intensity)*blue +
                        fade(0.0, 0.5, intensity)*cyan +
                        fade(0.25, 0.75, intensity)*green +
                        fade(0.5, 1.0, intensity)*yellow +
                        smoothstep(0.75, 1.0, intensity)*red
                    );
                    return color;
                }
            '''

        intensityToAlpha ?= true

        if intensityToAlpha
            [alphaStart, alphaEnd] = alphaRange ? [0,1]
            output = """
                vec4 alphaFun(vec3 color, float intensity){
                    float alpha = smoothstep(#{alphaStart.toFixed(8)}, #{alphaEnd.toFixed(8)}, intensity);
                    return vec4(color*alpha, alpha);
                }
            """
        else
            output = '''
                vec4 alphaFun(vec3 color, float intensity){
                    return vec4(color, 1.0);
                }
            '''

        @shader = new Shader @gl,
            vertex: vertexShaderBlit
            fragment: fragmentShaderBlit + """
                float linstep(float low, float high, float value){
                    return clamp((value-low)/(high-low), 0.0, 1.0);
                }

                float fade(float low, float high, float value){
                    float mid = (low+high)*0.5;
                    float range = (high-low)*0.5;
                    float x = 1.0 - clamp(abs(mid-value)/range, 0.0, 1.0);
                    return smoothstep(0.0, 1.0, x);
                }

                #{getColorFun}
                #{output}

                void main(){
                    float intensity = smoothstep(0.0, 1.0, texture2D(source, texcoord).r);
                    vec3 color = getColor(intensity);
                    gl_FragColor = alphaFun(color, intensity);
                }
            """

        @width ?= @canvas.offsetWidth or 2
        @height ?= @canvas.offsetHeight or 2
        @canvas.width = @width
        @canvas.height = @height
        @gl.viewport(0, 0, @width, @height)
        
        @quad = @gl.createBuffer()
        @gl.bindBuffer @gl.ARRAY_BUFFER, @quad
        quad = new Float32Array([
            -1, -1, 0, 1,
            1, -1, 0, 1,
            -1, 1, 0, 1,
            
            -1, 1, 0, 1,
            1, -1, 0, 1,
            1, 1, 0, 1,
        ])
        @gl.bufferData @gl.ARRAY_BUFFER, quad, @gl.STATIC_DRAW
        @gl.bindBuffer @gl.ARRAY_BUFFER, null
        
        @heights = new Heights @, @gl, @width, @height
    
    adjustSize: ->
        canvasWidth = @canvas.offsetWidth or 2
        canvasHeight = @canvas.offsetHeight or 2

        if @width isnt canvasWidth or @height isnt canvasHeight
            @gl.viewport 0, 0, canvasWidth, canvasHeight
            @canvas.width = canvasWidth
            @canvas.height = canvasHeight
            @width = canvasWidth
            @height = canvasHeight
            @heights.resize @width, @height

    display: ->
        @gl.bindBuffer @gl.ARRAY_BUFFER, @quad
        @gl.vertexAttribPointer(0, 4, @gl.FLOAT, false, 0, 0)
        @heights.nodeFront.bind(0)
        if @gradientTexture
            @gradientTexture.bind(1)
        @shader.use().int('source', 0).int('gradientTexture', 1)
        @gl.drawArrays @gl.TRIANGLES, 0, 6

    update: ->
        @heights.update()

    clear: -> @heights.clear()
    clamp: (min=0, max=1) -> @heights.clamp(min, max)
    multiply: (value=0.95) -> @heights.multiply(value)
    blur: -> @heights.blur()

    addPoint: (x, y, size, intensity) -> @heights.addPoint x, y, size, intensity
    addPoints: (items) -> (@addPoint item.x, item.y, item.size, item.intensity for item in items)

window.createWebGLHeatmap = (params) -> new WebGLHeatmap(params)
