import sys 
sys.path.append("/Users/shuge/Library/Python/3.8/lib/python/site-packages/Conan/")
import logging as rel_log
import os
import shutil
from datetime import timedelta
from flask import *
import pandas as pd
from Conan.src.model import MultiDimContrastPatternMiner 
from Conan.src.search.scoring_func import count_agg_func, diff_score, ratio_diff_score, lift_score 


UPLOAD_FOLDER = r'./uploads'

ALLOWED_EXTENSIONS = set(['png'])
app = Flask(__name__)
# app.secret_key = 'secret!'
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# werkzeug_logger = rel_log.getLogger('werkzeug')
# werkzeug_logger.setLevel(rel_log.ERROR)

# # 解决缓存刷新问题
# app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)


# 添加header解决跨域
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, X-Requested-With'
    return response

# [“scoring function”: {diff, xx, xx, xx}​

# “iteration step”: 500, (max = 2000)​

# “max pattern number”: 10, (max = 30)​

# “max pattern length”: 5 (max = 8)]


@app.route('/conan/file', methods=["POST"])
def conan_file():
    
    file = request.files['file']
    iterationSteps = int(request.form['iterationSteps'])
    patternNumber = int(request.form['patternNumber'])
    patternLength = int(request.form['patternLength'])
    data = pd.read_csv(file)

    data.columns = data.columns.map(lambda x:x.lower())

    instance_identifier_col = "requestid"
    attribute_cols = []

    # check if all mandatory cols provided
    CLASS_COL = "label"
    WEIGHT_COL = "weight"
    
    MANDATORY_COLS = [instance_identifier_col, CLASS_COL, WEIGHT_COL]
    dic = dict(zip(MANDATORY_COLS,[0]*len(MANDATORY_COLS)))
    for column in data:
        column = column.lower()
        if column in dic:
            dic[column] = 1
        else:
            attribute_cols.append(column)
    isValid = 1
    for v in dic.values():
        isValid &= v
    if not isValid:
        return abort(400, {'message': 'id, label and weight all required'})

    # pass into CONAN
    model = MultiDimContrastPatternMiner(data, instance_identifier_col, attribute_cols, CLASS_COL, WEIGHT_COL, search_algo="MetaSearch") 
    model.build_core_data_model() 
    results = model.run_search(scoring_func=ratio_diff_score, agg_func=count_agg_func, max_step=iterationSteps, max_vain_step=20, max_pattern_num=patternNumber, max_pattern_len=patternLength) 
    
    results = model.post_processing(results) 

    # model = MultiDimContrastPatternMiner(data, instance_identifier_col, attribute_cols, CLASS_COL, WEIGHT_COL, search_algo="MetaSearch")
    # model.build_core_data_model()
    # results = model.run_search(scoring_func=ratio_diff_score, agg_func=count_agg_func, max_step = 500, max_vain_step=50, max_pattern_num=10, max_pattern_len=5)
    # results = model.post_processing(results)
    r = []
    for index, row in results.iterrows():
        temp = {}
        for col in results.columns:
            temp[col] = row[col]
        temp = {
            'score': temp['score'],
            'diagnosis_results': dict(temp['pattern']),
        }
        r.append(temp)

    return jsonify({'data':r})


# @app.route('/upload', methods=['GET', 'POST'])
# def upload_file():
#     file = request.files['file']
#     print(datetime.datetime.now(), file.filename)
#     if file and allowed_file(file.filename):
#         src_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
#         file.save(src_path)
#         shutil.copy(src_path, './tmp/ct')
#         image_path = os.path.join('./tmp/ct', file.filename)
#         print(src_path, image_path)
#         pid, image_info = core.main.c_main(image_path, current_app.model)
#         return jsonify({'status': 1,
#                         'image_url': 'http://127.0.0.1:5003/tmp/ct/' + pid,
#                         'draw_url': 'http://127.0.0.1:5003/tmp/draw/' + pid,
#                         'image_info': image_info
#                         })

#     return jsonify({'status': 0})


# @app.route("/download", methods=['GET'])
# def download_file():
#     # 需要知道2个参数, 第1个参数是本地目录的path, 第2个参数是文件名(带扩展名)
#     return send_from_directory('data', 'testfile.zip', as_attachment=True)


# # show photo
# @app.route('/tmp/<path:file>', methods=['GET'])
# def show_photo(file):
#     if request.method == 'GET':
#         if not file is None:
#             image_data = open(f'tmp/{file}', "rb").read()
#             response = make_response(image_data)
#             response.headers['Content-Type'] = 'image/png'
#             return response

if __name__ == '__main__':
#     files = [
#         'uploads', 'tmp/ct', 'tmp/draw',
#         'tmp/image', 'tmp/mask', 'tmp/uploads'
#     ]
#     for ff in files:
#         if not os.path.exists(ff):
#             os.makedirs(ff)
#     with app.app_context():
#         current_app.model = deploy.Predictor(
#             './core/net/inference_model', use_gpu=True)
    app.run(host='127.0.0.1', port=5003, debug=True)
